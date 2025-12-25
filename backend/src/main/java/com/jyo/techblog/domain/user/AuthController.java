package com.jyo.techblog.domain.user;

import com.jyo.techblog.domain.user.dto.LoginRequest;
import com.jyo.techblog.domain.user.dto.LoginResponse;
import com.jyo.techblog.domain.user.dto.RegisterRequest;
import com.jyo.techblog.domain.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 인증 관련 API 컨트롤러
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    /**
     * 회원가입
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        // 초반엔 1인 블로그로 가기로 해서 회원가입 기능 막기
        throw new RuntimeException("현재 회원가입 기능은 닫혀있습니다. 관리자에게 문의하세요.");

        // UserResponse response = userService.register(request);
        // return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 로그인 (JWT 전 단계)
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

}
