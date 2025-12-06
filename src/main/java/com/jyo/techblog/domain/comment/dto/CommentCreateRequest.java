package com.jyo.techblog.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentCreateRequest {

    // 댓글 내용만 받기 (postId는 URL에서 받음)
    @NotBlank 
    private String content;  // 댓글 내용
}
