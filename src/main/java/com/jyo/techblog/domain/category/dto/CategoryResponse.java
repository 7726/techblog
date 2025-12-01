package com.jyo.techblog.domain.category.dto;

import com.jyo.techblog.domain.category.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor(staticName = "of")
public class CategoryResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CategoryResponse from(Category category) {
        return CategoryResponse.of(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
