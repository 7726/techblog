package com.jyo.techblog.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 회원 조회 (로그인 시 사용)
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
