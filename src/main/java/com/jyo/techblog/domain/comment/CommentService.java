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

    @Transactional
    public CommentResponse create(String userEmail, CommentCreateRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Post post = postRepository.findById(request.postId())
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(request.content())
                .build();

        Comment saved = commentRepository.save(comment);
        return CommentResponse.from(saved);
    }

    @Transactional
    public CommentResponse update(Long commentId, String userEmail, CommentUpdateRequest request) {
        Comment comment = getActiveCommentOrThrow(commentId);

        if (!comment.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("본인 댓글만 수정할 수 있습니다.");
        }

        comment.updateContent(request.content());
        return CommentResponse.from(comment);
    }

    @Transactional
    public void delete(Long commentId, String userEmail) {
        Comment comment = getActiveCommentOrThrow(commentId);

        if (!comment.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("본인 댓글만 삭제할 수 있습니다.");
        }

        comment.softDelete();
    }

    public Page<CommentResponse> getByPost(Long postId, Pageable pageable) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        return commentRepository.findByPostAndDeletedFalse(post, pageable)
                .map(CommentResponse::from);
    }

    private Comment getActiveCommentOrThrow(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (comment.isDeleted()) {
            throw new IllegalArgumentException("삭제된 댓글입니다.");
        }

        return comment;
    }
}
