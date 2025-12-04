package com.jyo.techblog.domain.comment.dto;

import com.jyo.techblog.domain.comment.Comment;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        Long postId,
        Long userId,
        String userEmail,
        String content,
        LocalDateTime createdAt
) {

    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getPost().getId(),
                comment.getUser().getId(),
                comment.getUser().getEmail(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
