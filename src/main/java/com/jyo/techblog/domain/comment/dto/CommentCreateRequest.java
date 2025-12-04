package com.jyo.techblog.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentCreateRequest(
        @NotNull Long postId,
        @NotBlank String content
) {
}
