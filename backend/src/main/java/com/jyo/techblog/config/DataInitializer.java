package com.jyo.techblog.config;

import com.jyo.techblog.domain.category.Category;
import com.jyo.techblog.domain.category.CategoryRepository;
import com.jyo.techblog.domain.user.Role;
import com.jyo.techblog.domain.user.User;
import com.jyo.techblog.domain.user.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 애플리케이션 시작 시 기본 데이터 (관리자 계정, 기본 카테고리) 생성
 */
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void init() {
        initAdminUser();
        initCategories();
    }

    private void initAdminUser() {
        String adminEmail = "admin@jyo.dev";

        if (userRepository.existsByEmail(adminEmail)) {
            return;  // 이미 있으면 생성 X
        }

        String encodedPassword = passwordEncoder.encode("admin1234");  // 나중에 변경

        User admin = User.createUser(
                adminEmail,
                encodedPassword,
                "관리자",
                Role.ADMIN
        );

        userRepository.save(admin);
    }

    private void initCategories() {
        List<String> defaultNames = List.of(
                "공지",
                "개발",
                "Spring",
                "일상"
        );

        for (String name : defaultNames) {
            if (categoryRepository.existsByNameAndDeletedFalse(name)) {
                continue;
            }

            Category category = Category.create(name, null);
            categoryRepository.save(category);
        }
    }

}
