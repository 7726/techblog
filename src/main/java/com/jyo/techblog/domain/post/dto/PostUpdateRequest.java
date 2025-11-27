package com.jyo.techblog.domain.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 게시글 수정 요청 DTO
 */
@Getter
@Setter
public class PostUpdateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;
}
