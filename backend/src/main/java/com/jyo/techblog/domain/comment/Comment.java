package com.jyo.techblog.domain.comment;

import com.jyo.techblog.common.BaseTimeEntity;
import com.jyo.techblog.domain.post.Post;
import com.jyo.techblog.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * 댓글 엔티티
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // JPA 프록시 및 기본 생성자 보호
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어느 게시글의 댓글인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // 누가 쓴 댓글인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(nullable = false, length = 1000)
    private String content;

    // 비회원용 필드 (작성자명, 비밀번호)
    private String authorName;  // 비회원 닉네임
    private String password;  // 비회원 댓글 삭제용 비밀번호

    @Column(nullable = false)
    private boolean deleted = false;

    // 생성 전용 생성자 (외부에서는 of() 정적 메서드로만 생성하게)
    @Builder
    private Comment(Post post, User user, String content, String authorName, String password) {
        this.post = post;
        this.user = user;
        this.content = content;
        this.authorName = authorName;
        this.password = password;
    }

    // 정적 팩토리 메서드 (회원용)
    public static Comment of(Post post, User user, String content) {
        return Comment.builder()
                .post(post)
                .user(user)
                .content(content)
                .authorName(user.getNickname())  // 회원은 닉네임 자동 설정
                .build();
    }

    // 정적 팩토리 메서드 (비회원용)
    public static Comment createAnonymous(Post post, String content, String authorName, String password) {
        return Comment.builder()
                .post(post)
                .user(null)  // 비회원은 user가 null
                .content(content)
                .authorName(authorName)
                .password(password)
                .build();
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void softDelete() {
        this.deleted = true;
    }
}
