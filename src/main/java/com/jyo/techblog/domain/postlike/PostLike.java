package com.jyo.techblog.domain.postlike;

import com.jyo.techblog.common.BaseTimeEntity;
import com.jyo.techblog.domain.post.Post;
import com.jyo.techblog.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 게시글 좋아요 엔티티
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostLike extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어느 게시글에 대한 좋아요인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // 회원이 누른 좋아요일 경우만 값이 있음 (비회원이면 null)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 비회원이 누른 좋아요일 경우만 값이 있음 (회원이면 null)
    @Column(length = 45)  // IPv4, IPv6 문자열 저장용
    private String ipAddress;

    // true = 회원 좋아요, false = 비회원(IP) 좋아요
    @Column(nullable = false)
    private boolean memberLike;

    @Column(nullable = false)
    private boolean deleted = false;

    // 내부 생성자 (외부에서는 정적 팩토리 메서드로만 생성)
    private PostLike(Post post, User user, String ipAddress, boolean memberLike) {
        this.post = post;
        this.user = user;
        this.ipAddress = ipAddress;
        this.memberLike = memberLike;
    }

    // 회원 좋아요용 팩토리 메서드
    public static PostLike member(Post post, User user) {
        return new PostLike(post, user, null, true);
    }

    // 비회원(IP) 좋아요용 팩토리 메서드
    public static PostLike guest(Post post, String ipAddress) {
        return new PostLike(post, null, ipAddress, false);
    }

    // 좋아요 취소 (soft delete)
    public void softDelete() {
        this.deleted = true;
    }

}
