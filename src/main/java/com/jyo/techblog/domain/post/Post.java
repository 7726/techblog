package com.jyo.techblog.domain.post;

import com.jyo.techblog.common.BaseTimeEntity;
import com.jyo.techblog.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 블로그 글 엔티티
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "posts")
public class Post extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;  // 글 제목

    @Lob  // 긴 텍스트 저장 (위지윅에서 내려오는 HTML 컨텐츠)
    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)  // 여러 글이 하나의 작성자를 가질 수 있음
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    // 소프트 삭제
    @Column(nullable = false)
    private boolean deleted = false;

    //== 생성 메서드 ==//
    public static Post createPost(String title, String content, User author) {
        Post post = new Post();
        post.title = title;
        post.content = content;
        post.author = author;
        return post;
    }

    //== 수정 메서드 ==//
    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    // 소프트 삭제
    public void softDelete() {
        this.deleted = true;
    }
}
