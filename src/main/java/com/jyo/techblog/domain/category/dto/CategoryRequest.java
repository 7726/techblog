package com.jyo.techblog.domain.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    @NotBlank(message = "카테고리 이름은 필수입니다.")
    private String name;

    private String description;
}
