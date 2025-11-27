package com.jyo.techblog.domain.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 게시글 작성 요청 DTO
 */
@Getter
@Setter
public class PostCreateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;  // 위지윅에서 내려오는 HTML

}
