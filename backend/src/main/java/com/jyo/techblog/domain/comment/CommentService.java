package com.jyo.techblog.domain.comment;

import com.jyo.techblog.domain.comment.dto.CommentCreateRequest;
import com.jyo.techblog.domain.comment.dto.CommentResponse;
import com.jyo.techblog.domain.comment.dto.CommentUpdateRequest;
import com.jyo.techblog.domain.post.Post;
import com.jyo.techblog.domain.post.PostRepository;
import com.jyo.techblog.domain.user.User;
import com.jyo.techblog.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * 댓글 생성
     * - 로그인한 사용자 이메일로 User 조회
     * - 게시글 ID로 Post 조회
     * - Comment 엔티티 생성 후 저장
     */
    @Transactional
    public CommentResponse create(String userEmail, Long postId, CommentCreateRequest request) {
        // 댓글 작성자 조회
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 댓글 달 게시글 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 엔티티 생성
        Comment comment = Comment.of(post, user, request.getContent());

        // 저장 후 DTO로 변환
        Comment saved = commentRepository.save(comment);
        return CommentResponse.from(saved);
    }

    /**
     * 댓글 수정
     * - 댓글 존재 여부 확인
     * - 삭제된 댓글인지 확인
     * - 작성자 본인인지 검증
     * - 내용 수정
     */
    @Transactional
    public CommentResponse update(Long commentId, String userEmail, CommentUpdateRequest request) {
        // 활성 상태의 댓글 조회
        Comment comment = getActiveCommentOrThrow(commentId);

        // 작성자 본인인지 확인
        if (!comment.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("본인 댓글만 수정할 수 있습니다.");
        }

        // 내용 수정
        comment.updateContent(request.getContent());

        // 변경감지를 통해 자동 업데이트 -> 현재 엔티티 기준 DTO 변환
        return CommentResponse.from(comment);
    }

    /**
     * 댓글 삭제
     * - 댓글 존재 여부 확인
     * - 삭제된 댓글인지 확인
     * - 작성자 본인인지 검증
     * - deleted 플래그만 true로 변경
     */
    @Transactional
    public void delete(Long commentId, String userEmail) {
        // 활성 상태의 댓글 조회
        Comment comment = getActiveCommentOrThrow(commentId);

        // 작성자 본인인지 확인
        if (!comment.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("본인 댓글만 삭제할 수 있습니다.");
        }

        comment.softDelete();
    }

    /**
     * 게시글 기준 댓글 목록 조회 (페이징)
     * - 삭제되지 않은 댓글만 조회
     */
    public Page<CommentResponse> getByPost(Long postId, Pageable pageable) {
        // 게시글 존재 여부 확인
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 댓글 목록 조회 후 DTO 변환
        return commentRepository.findByPostAndDeletedFalse(post, pageable)
                .map(CommentResponse::from);
    }

    /**
     * 삭제되지 않은 댓글만 조회하는 내부 유틸 메서드
     */
    private Comment getActiveCommentOrThrow(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (comment.isDeleted()) {
            throw new IllegalArgumentException("삭제된 댓글입니다.");
        }

        return comment;
    }
}
