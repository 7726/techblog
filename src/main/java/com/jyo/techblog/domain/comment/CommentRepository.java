package com.jyo.techblog.domain.comment;

import com.jyo.techblog.domain.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPostAndDeletedFalse(Post post, Pageable pageable);
}
