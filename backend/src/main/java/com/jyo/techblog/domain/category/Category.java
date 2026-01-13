package com.jyo.techblog.domain.category;

import com.jyo.techblog.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * 게시글 카테고리 엔티티
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "categories")
public class Category extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;  // 게시글 주제

    @Column(length = 255)
    private String description;   // 카테고리 설명

    @Column(nullable = false)
    private boolean deleted = false;

    public static Category create(String name, String description) {
        Category category = new Category();
        category.name = name;
        category.description = description;
        return category;
    }

    public void update(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void softDelete() {
        this.deleted = true;
    }
}
