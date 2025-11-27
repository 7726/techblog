package com.jyo.techblog.domain.post;

import com.jyo.techblog.domain.post.dto.PostCreateRequest;
import com.jyo.techblog.domain.post.dto.PostResponse;
import com.jyo.techblog.domain.post.dto.PostUpdateRequest;
import com.jyo.techblog.domain.user.User;
import com.jyo.techblog.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 게시글 관련 비즈니스 로직
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * 게시글 작성 (로그인 필요)
     */
    @Transactional
    public PostResponse createPost(Long userId, PostCreateRequest request) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다"));

        Post post = Post.createPost(
                request.getTitle(),
                request.getContent(),
                author
        );

        Post saved = postRepository.save(post);
        return PostResponse.from(saved);
    }

    /**
     * 게시글 단건 조회
     */
    public PostResponse getPost(Long postId) {
        Post post = postRepository.findByIdAndDeletedFalse(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        return PostResponse.from(post);
    }

    /**
     * 게시글 목록 조회 (간단 검색 포함)
     * - keyword가 없으면 전체 목록
     * - keyword가 있으면 제목 or 내용만 포함된 글만
     */
    public List<PostResponse> getPosts(String keyword) {
        List<Post> posts;

        if (keyword == null || keyword.isBlank()) {
            posts = postRepository.findByDeletedFalse();
        } else {
            posts = postRepository.searchByKeyword(keyword);
        }

        return posts.stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 게시글 수정
     * - 작성자 본인 또는 ADMIN만 허용
     */
    @Transactional
    public PostResponse updatePost(
            Long userId,
            boolean isAdmin,
            Long postId,
            PostUpdateRequest request
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (post.isDeleted()) {
            throw new IllegalStateException("이미 삭제된 게시글입니다.");
        }

        // 권한 체크
        if (!isAdmin && !post.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("본인의 글만 수정할 수 있습니다.");
        }

        post.update(request.getTitle(), request.getContent());
        return PostResponse.from(post);
    }

    /**
     * 게시글 삭제
     * - 작성자 본인 또는 ADMIN만 허용
     */
    @Transactional
    public void deletePost(Long userId, boolean isAdmin, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (post.isDeleted()) {
            // 이미 삭제된 글이지만 또 삭제 요청 들어오면 굳이 에러를 낼지, 그냥 무시할지 취향 차이
            throw new IllegalStateException("이미 삭제된 게시글 입니다.");
        }

        if (!isAdmin && !post.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("본인의 글만 삭제할 수 있습니다.");
        }

        post.softDelete();
    }

}
