package com.jyo.techblog.domain.comment;

import com.jyo.techblog.domain.comment.dto.CommentResponse;
import com.jyo.techblog.domain.post.Post;
import com.jyo.techblog.domain.post.PostRepository;
import com.jyo.techblog.domain.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @InjectMocks
    private CommentService commentService;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostRepository postRepository; // createComment 등에서 필요할 수 있어 선언

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("비회원 댓글 삭제 성공 - 비밀번호 일치")
    void deleteAnonymousComment_Success() {
        // given
        Long commentId = 1L;
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123";

        // 비회원 댓글 생성 (User = null)
        Comment comment = Comment.builder()
                .content("테스트 댓글")
                .authorName("익명")
                .password(encodedPassword)
                .user(null) // 비회원 명시
                .build();

        // Mocking: 댓글 조회 시 위 객체 반환
        given(commentRepository.findById(commentId)).willReturn(Optional.of(comment));
        // Mocking: 비밀번호 비교 시 '일치함(true)' 반환
        given(passwordEncoder.matches(rawPassword, encodedPassword)).willReturn(true);

        // when
        // userId = null (비회원 요청), rawPassword 입력
        commentService.deleteComment(commentId, null, rawPassword);

        // then
        // deleted 상태가 true로 변경되었는지 검증
        assertThat(comment.isDeleted()).isTrue();
    }

    @Test
    @DisplayName("비회원 댓글 삭제 실패 - 비밀번호 불일치")
    void deleteAnonymousComment_Fail_WrongPassword() {
        // given
        Long commentId = 1L;
        String rawPassword = "wrongPassword";
        String encodedPassword = "encodedPassword123";

        Comment comment = Comment.builder()
                .content("테스트 댓글")
                .password(encodedPassword)
                .user(null)
                .build();

        given(commentRepository.findById(commentId)).willReturn(Optional.of(comment));
        // Mocking: 비밀번호 비교 시 '불일치(false)' 반환
        given(passwordEncoder.matches(rawPassword, encodedPassword)).willReturn(false);

        // when & then
        assertThatThrownBy(() -> commentService.deleteComment(commentId, null, rawPassword))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("비밀번호가 일치하지 않습니다."); // Service의 메시지와 일치해야 함
    }
}