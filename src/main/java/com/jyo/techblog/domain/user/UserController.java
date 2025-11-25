package com.jyo.techblog.domain.user;

import com.jyo.techblog.domain.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 회원 관련 조회 API
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    /**
     * 현재 로그인한 사용자 정보 조회
     * - Authorization 헤더의 JWT 토큰에서 userId를 꺼내서 사용
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication) {
        // JwtAuthenticationFilter 에서 넣어준 principal = userId (Long)
        Long userId = (Long) authentication.getPrincipal();

        UserResponse response = userService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }

}
