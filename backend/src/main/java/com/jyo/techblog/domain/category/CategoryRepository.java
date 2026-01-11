package com.jyo.techblog.domain.category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // 카테고리 이름순 조회
    List<Category> findAllByDeletedFalseOrderByNameAsc();

    // 카테고리명 중복 체크
    boolean existsByNameAndDeletedFalse(String name);

    // 카테고리 단건 조회
    Optional<Category> findByIdAndDeletedFalse(Long id);
}
