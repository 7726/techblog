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

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;  // 위지윅에서 내려오는 HTML

}
