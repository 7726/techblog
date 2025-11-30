package com.jyo.techblog.domain.post;

import com.jyo.techblog.domain.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 삭제되지 않은 글 단건 조회
    Optional<Post> findByIdAndDeletedFalse(Long id);

    // 삭제되지 않은 글 목록 전체
    List<Post> findByDeletedFalse(Pageable pageable);

    // 삭제되지 않은 글만 대상 + 제목/내용 검색
    @Query("""
        SELECT p
        FROM Post p
        WHERE p.deleted = false
        AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)
    """)
    List<Post> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 필요하면 특정 작성자의 글들 검색 (삭제되지 않은 것만)
    List<Post> findByAuthorAndDeletedFalse(User author, Pageable pageable);
}
