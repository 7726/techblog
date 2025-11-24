package com.jyo.techblog.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * 임시 Security 설정
 * - 일단 모든 요청 OPEN
 * - H2 콘솔 접속 허용
 * - 기본 로그인 페이지 비활성화
 * - 추후 JWT 인증/인가 로직 넣을 예정
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // h2-console 사용 + CSRF 비활성화
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(PathRequest.toH2Console())
                        .disable()
                )
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                )
                .authorizeHttpRequests(auth -> auth
                        // H2 콘솔 모두 허용
                        .requestMatchers("/h2-console/**").permitAll()
                        // API 전부 임시로 허용
                        .requestMatchers("/api/**").permitAll()
                        // 나머지도 일단 허용
                        .anyRequest().permitAll()
                )
                // 기본 로그인 폼, HTTP Basic 비활성화
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 비밀번호 암호화에 사용
        return new BCryptPasswordEncoder();
    }
}
