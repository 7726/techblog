package com.jyo.techblog.domain.postlike;

import com.jyo.techblog.domain.post.Post;
import com.jyo.techblog.domain.post.PostRepository;
import com.jyo.techblog.domain.postlike.dto.PostLikeResponse;
import com.jyo.techblog.domain.user.User;
import com.jyo.techblog.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /**
     * 회원 좋아요
     * - 이미 좋아요 눌렀으면 아무 일도 안하고 상태만 반환
     */
    @Transactional
    public PostLikeResponse likeAsMember(Long postId, String userEmail) {
        // 1) 게시글, 사용자 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2) 이미 좋아요 눌렀는지 체크
        boolean exists = postLikeRepository.existsByPostAndUserAndDeletedFalse(post, user);
        if (!exists) {
            // 3) 없으면 새로 생성
            PostLike like = PostLike.member(post, user);
            postLikeRepository.save(like);
        }

        // 4) 최종 카운트 + likedByMe 반환
        long count = postLikeRepository.countByPostAndDeletedFalse(post);
        return PostLikeResponse.of(count, true);
    }

    /**
     * 비회원(IP) 좋아요
     * - 같은 IP로 이미 눌렀으면 아무 일도 안하고 상태만 반환
     */
    @Transactional
    public PostLikeResponse likeAsGuest(Long postId, String ipAddress) {
        // 1) 게시글 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 2) 이미 이 IP로 눌렀는지 체크 (memberLike = false 고정)
        boolean exists = postLikeRepository
                .existsByPostAndIpAddressAndMemberLikeAndDeletedFalse(post, ipAddress, false);

        if (!exists) {
            // 3) 없으면 새로 생성
            PostLike like = PostLike.guest(post, ipAddress);
            postLikeRepository.save(like);
        }

        // 4) 최종 카운트 + likedByMe 반환
        long count = postLikeRepository.countByPostAndDeletedFalse(post);
        return PostLikeResponse.of(count, true);
    }

    /**
     * 회원 좋아요 취소 (soft delete)
     * - 비회원은 취소 기능 X
     */
    @Transactional
    public PostLikeResponse cancelMemberLike(Long postId, String userEmail) {
        // 1) 게시글, 사용자 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2) 활성화된 좋아요 찾기
        PostLike like = postLikeRepository.findByPostAndUserAndDeletedFalse(post, user)
                .orElseThrow(() -> new IllegalArgumentException("좋아요를 누른 이력이 없습니다."));

        // 3) soft delete
        like.softDelete();

        // 4) 최종 카운트 + likedByMe=false 반환
        long count = postLikeRepository.countByPostAndDeletedFalse(post);
        return PostLikeResponse.of(count, false);
    }

    /**
     * 좋아요 상태 조회
     * - 로그인: 회원 기준
     * - 비로그인: IP 기준
     */
    public PostLikeResponse getStatus(Long postId, String userEmailOrNull, String ipAddress) {
        // 1) 게시글 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 2) 전체 카운트
        long count = postLikeRepository.countByPostAndDeletedFalse(post);

        // 3) 내가 눌렀는지 여부 계산
        boolean likedByMe = false;

        if (userEmailOrNull != null) {
            // 회원 기준 체크
            User user = userRepository.findByEmail(userEmailOrNull)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            likedByMe = postLikeRepository.existsByPostAndUserAndDeletedFalse(post, user);
        } else {
            // 비회원(IP) 기준 체크
            likedByMe = postLikeRepository
                    .existsByPostAndIpAddressAndMemberLikeAndDeletedFalse(post, ipAddress, false);
        }

        return PostLikeResponse.of(count, likedByMe);
    }
}
