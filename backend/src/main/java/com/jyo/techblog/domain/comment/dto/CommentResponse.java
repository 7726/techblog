package com.jyo.techblog.domain.comment.dto;

import com.jyo.techblog.domain.comment.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private Long postId;
    private Long userId;  // 비회원이면 null (프론트 본인 확인용)
    private String authorName;  // 작성자 닉네임 (회원 닉네임 or 비회원 입력 닉네임)
    private String content;
    private LocalDateTime createdAt;

    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getPost().getId(),
                comment.getUser() != null ? comment.getUser().getId() : null,
                comment.getAuthorName(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
