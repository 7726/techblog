package com.jyo.techblog.domain.postlike;

import com.jyo.techblog.common.util.IpUtils;
import com.jyo.techblog.domain.postlike.dto.PostLikeResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class PostLikeController {

    private final PostLikeService postLikeService;

    /**
     * 좋아요 누르기 (회원 + 비회원 공통)
     * - URL: POST /posts/{postId}/likes
     * - 로그인 상태면: 회원 기준
     * - 비로그인 상태면: IP 기준
     */
    @PostMapping("/posts/{postId}/likes")
    public PostLikeResponse like(
            @PathVariable Long postId,
            HttpServletRequest request,
            Authentication authentication
    ) {
        String ip = IpUtils.getClientIp(request);

        // 로그인 여부에 따라 분기
        if (authentication == null || !authentication.isAuthenticated()) {
            // 비회원(IP) 좋아요
            return postLikeService.likeAsGuest(postId, ip);
        }

        String email = authentication.getName();
        return postLikeService.likeAsMember(postId, email);
    }

    /**
     * 회원 좋아요 취소
     * - URL: DELETE /posts/{postId}/likes
     * - 회원만 가능
     */
    @DeleteMapping("/posts/{postId}/likes")
    public PostLikeResponse cancelLike(
            @PathVariable Long postId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return postLikeService.cancelMemberLike(postId, email);
    }

    /**
     * 좋아요 상태 조회
     * - URL: GET /posts/{postId}/likes
     * - 응답: { likeCount, likedByMe }
     */
    @GetMapping("/posts/{postId}/likes")
    public PostLikeResponse getStatus(
            @PathVariable Long postId,
            HttpServletRequest request,
            Authentication authentication
    ) {
        String ip = IpUtils.getClientIp(request);

        if (authentication == null || !authentication.isAuthenticated()) {
            // 비회원 기준(IP)
            return postLikeService.getStatus(postId, null, ip);
        }

        String email = authentication.getName();
        return postLikeService.getStatus(postId, email, ip);
    }
}
