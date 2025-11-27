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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post) {
        return PostResponse.of(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getId(),
                post.getAuthor().getNickname(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

}
