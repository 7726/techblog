package com.jyo.techblog.domain.postview;

import com.jyo.techblog.domain.post.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostViewRepository extends JpaRepository<PostView, Long> {

    Optional<PostView> findByPostAndIpAddress(Post post, String ipAddress);
}
