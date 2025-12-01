package com.jyo.techblog.domain.post;

import com.jyo.techblog.domain.user.User;
import org.springframework.data.domain.Page;
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
    // V1
    @Query("""
        SELECT p
        FROM Post p
        WHERE p.deleted = false
        AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)
    """)
    List<Post> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // V2 (카테고리 추가 버전)
    @Query("""
        SELECT p
        FROM Post p
        WHERE p.deleted = false
        AND (
            :keyword IS NULL 
            OR :keyword = '' 
            OR p.title LIKE %:keyword% 
            OR p.content LIKE %:keyword%
        )
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
    """)
    Page<Post> search(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );
}
