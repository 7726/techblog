package com.jyo.techblog.domain.user;

import com.jyo.techblog.auth.JwtTokenProvider;
import com.jyo.techblog.domain.user.dto.LoginRequest;
import com.jyo.techblog.domain.user.dto.LoginResponse;
import com.jyo.techblog.domain.user.dto.RegisterRequest;
import com.jyo.techblog.domain.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 회원 관련 비즈니스 로직
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원가입
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 기본은 일반 사용자로 가입
        User user = User.createUser(
                request.getEmail(),
                encodedPassword,
                request.getNickname(),
                Role.USER
        );

        User saved = userRepository.save(user);
        return UserResponse.from(saved);
    }

    /**
     * 로그인 + AccessToken 발급
     */
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // JWT Access Token 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRole());

        // 나중엔 여기서 JWT 발급 예정
        return LoginResponse.of(accessToken, UserResponse.from(user));
    }

    /**
     * userId로 회원 조회 (인증된 사용자 정보 확인용)
     */
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return UserResponse.from(user);
    }

}
