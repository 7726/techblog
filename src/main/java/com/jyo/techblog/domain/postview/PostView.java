package com.jyo.techblog.domain.postview;

import com.jyo.techblog.common.BaseTimeEntity;
import com.jyo.techblog.domain.post.Post;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 조회수 중복 증가 방지용 엔티티/테이블 추가
 */

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostView extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 게시글 조회인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // 어떤 IP가 조회했는지
    @Column(nullable = false, length = 45)
    private String ipAddress;

    // 마지막으로 조회수 반영된 시각 (쿨타임 체크용)
    @Column(nullable = false)
    private LocalDateTime lastViewedAt;

    private PostView(Post post, String ipAddress, LocalDateTime lastViewedAt) {
        this.post = post;
        this.ipAddress = ipAddress;
        this.lastViewedAt = lastViewedAt;
    }

    public static PostView of(Post post, String ipAddress, LocalDateTime now) {
        return new PostView(post, ipAddress, now);
    }

    public void touch(LocalDateTime now) {
        this.lastViewedAt = now;
    }
}
