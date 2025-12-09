package com.jyo.techblog.domain.postlike;

import com.jyo.techblog.domain.post.Post;
import com.jyo.techblog.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    // 회원이 누른 좋아요가 이미 있는지 확인
    boolean existsByPostAndUserAndDeletedFalse(Post post, User user);

    // 비회원(IP)이 누른 좋아요가 이미 있는지 확인
    boolean existsByPostAndIpAddressAndMemberLikeAndDeletedFalse(Post post, String ipAddress, boolean memberLike);

    // 전체 좋아요 수 (삭제되지 않은 것만)
    long countByPostAndDeletedFalse(Post post);

    // 회원이 누른 좋아요 조회 (취소용)
    Optional<PostLike> findByPostAndUserAndDeletedFalse(Post post, User user);
}
