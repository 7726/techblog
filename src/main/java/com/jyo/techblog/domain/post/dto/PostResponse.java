package com.jyo.techblog.domain.post.dto;

import com.jyo.techblog.domain.post.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 게시글 응답 DTO
 */
@Getter
@AllArgsConstructor(staticName = "of")
public class PostResponse {
    
    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private String authorNickname;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post) {
        Long categoryId = null;
        String categoryName = null;

        if (post.getCategory() != null) {
            categoryId = post.getCategory().getId();
            categoryName = post.getCategory().getName();
        }

        return PostResponse.of(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getId(),
                post.getAuthor().getNickname(),
                categoryId,
                categoryName,
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

}
