package com.jyo.techblog.domain.post;

import com.jyo.techblog.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 간단 검색용 (제목 or 내용에 키워드 포함)
    List<Post> findByTitleContainingOrContentContaining(String titleKeyword, String contentKeyword);

    // 특정 작성자의 글 목록
    List<Post> findByAuthor(User author);
}
