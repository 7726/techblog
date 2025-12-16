package com.jyo.techblog.domain.postview;

import com.jyo.techblog.domain.post.Post;
import com.jyo.techblog.domain.post.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

/**
 * 조회수 중복 증가 방지용 비즈니스 로직
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostViewService {

    private final PostRepository postRepository;
    private final PostViewRepository postViewRepository;

    // 같은 IP가 같은 글을 다시 조회해도, 이 시간 지나기 전엔 조회수 증가 안 함
    private static final Duration COOLDOWN = Duration.ofMinutes(10);

    /**
     * 게시글 조회수 증가 (IP 기반 쿨타임 적용)
     * - 쿨타임 내 재조회면 증가 X
     * - 쿨타임 지나면 증가 O + lastViewAt 갱신
     */
    @Transactional
    public void increaseViewCountIfNeeded(Long postId, String ipAddress) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        LocalDateTime now = LocalDateTime.now();

        PostView postView = postViewRepository.findByPostAndIpAddress(post, ipAddress)
                .orElse(null);

        // 처음 보는 IP면 조회수 증가 + 기록 생성
        if (postView == null) {
            post.increaseViewCount();
            postViewRepository.save(PostView.of(post, ipAddress, now));
            return;
        }

        // 마지막 조회 시각 기준 쿨타임 체크
        LocalDateTime last = postView.getLastViewedAt();
        boolean cooldownPassed = last.plus(COOLDOWN).isBefore(now);

        if (cooldownPassed) {
            post.increaseViewCount();
            postView.touch(now);  // lastViewedAt 갱신
        }
        // 쿨타임 안 지났으면 아무 것도 안 함
    }
}
