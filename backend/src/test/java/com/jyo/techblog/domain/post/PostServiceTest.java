package com.jyo.techblog.domain.post;

import com.jyo.techblog.domain.category.Category;
import com.jyo.techblog.domain.category.CategoryRepository;
import com.jyo.techblog.domain.post.dto.PostCreateRequest;
import com.jyo.techblog.domain.post.dto.PostResponse;
import com.jyo.techblog.domain.post.dto.PostUpdateRequest;
import com.jyo.techblog.domain.user.User;
import com.jyo.techblog.domain.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

/**
 * 1. 게시글 작성 성공: 입력값을 받아 저장하고 응답을 잘 반환하는지
 * 2. 게시글 단건 조회 성공: ID로 조회가 잘 되는지
 * 3. 게시글 수정 실패: 작성자가 아닌 사람이 수정하려 할 때 예외가 터지는지
 */
@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @InjectMocks
    private PostService postService;  // 가짜 객체들이 주입될 진짜 서비스

    @Mock
    private PostRepository postRepository;  // 가짜 리포지토리

    @Mock
    private UserRepository userRepository;  // 가짜 유저 리포지토리

    @Mock
    private CategoryRepository categoryRepository;  // 가짜 카테고리 리포지토리

    @Test
    @DisplayName("게시글 작성 성공")
    void createPost_Success() {
        // given (준비)
        Long userId = 1L;
        Long categoryId = 1L;

        // 가짜 데이터 생성
        User user = User.builder().id(userId).nickname("지호").build();
        Category category = Category.builder().id(categoryId).name("공지").build();

        PostCreateRequest request = new PostCreateRequest();
        request.setTitle("테스트 제목");
        request.setContent("테스트 내용");
        request.setCategoryId(categoryId);

        // Mocking: 리포지토리가 호출될 때 반환할 가짜 행동 정의
        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(categoryRepository.findByIdAndDeletedFalse(categoryId)).willReturn(Optional.of(category));

        // save() 호출 시 저장된 것처럼(ID가 있는) Post 객체 반환
        Post savedPost = Post.builder()
                .id(100L)
                .title(request.getTitle())
                .content(request.getContent())
                .author(user)
                .category(category)
                .build();
        given(postRepository.save(any(Post.class))).willReturn(savedPost);

        // when (실행)
        PostResponse response = postService.createPost(userId, request);

        // then (검증)
        assertThat(response.getId()).isEqualTo(100L);
        assertThat(response.getTitle()).isEqualTo("테스트 제목");
        assertThat(response.getAuthorNickname()).isEqualTo("지호");

        // save 메서드가 실제로 호출되었는지 검증
        verify(postRepository).save(any(Post.class));
    }

    @Test
    @DisplayName("게시글 수정 실패 - 작성자가 아닌 경우")
    void updatePost_Fail_NotOwner() {
        // given
        Long postId = 1L;
        Long requestUserId = 2L; // 요청자 (해커)
        boolean isAdmin = false;

        User owner = User.builder().id(1L).build(); // 실제 작성자
        Post post = Post.builder().id(postId).author(owner).build();

        PostUpdateRequest request = new PostUpdateRequest();
        request.setTitle("수정된 제목");
        request.setContent("수정된 내용");

        given(postRepository.findByIdAndDeletedFalse(postId)).willReturn(Optional.of(post));

        // when & then (예외 발생 검증)
        assertThatThrownBy(() -> postService.updatePost(requestUserId, isAdmin, postId, request))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("게시글 수정 권한이 없습니다.");
    }
}
