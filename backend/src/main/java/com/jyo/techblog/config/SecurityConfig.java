package com.jyo.techblog.config;

import com.jyo.techblog.auth.JwtAccessDeniedHandler;
import com.jyo.techblog.auth.JwtAuthenticationEntryPoint;
import com.jyo.techblog.auth.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * 임시 Security 설정
 * - H2 콘솔 접속 허용
 * - /api/auth/** 는 누구나 접근 가능
 * - 그 외 /api/** 는 인증 필요
 * - 나머지는 일단 허용
 */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final CorsConfig corsConfig;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // h2-console 사용 + CSRF 비활성화
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(PathRequest.toH2Console())
                        .disable()
                )
                .addFilter(corsConfig.corsFilter())
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                )
                .authorizeHttpRequests(auth -> auth
                        // H2 콘솔
                        .requestMatchers("/h2-console/**").permitAll()
                        // 이미지 조회 접근 허용
                        .requestMatchers("/files/**").permitAll()
                        // 인증/회원가입 API는 모두 허용
                        .requestMatchers("/api/auth/**").permitAll()
                        // 게시글, 카테고리 조회(GET)는 모두 허용
                        .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        // GET 댓글 조회는 permitAll
                        .requestMatchers(HttpMethod.GET, "/post/*/comments").permitAll()
                        // 비회원도 댓글 작성/삭제 가능
                        .requestMatchers(HttpMethod.POST, "/posts/*/comments").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/comments/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/comments/**").permitAll()
                        // 좋아요 기능 (상태 조회, 좋아요는 모두 가능, 취소는 회원만 가능)
                        .requestMatchers(HttpMethod.GET, "/posts/*/likes").permitAll()
                        .requestMatchers(HttpMethod.POST, "/posts/*/likes").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/posts/*/likes").hasAnyRole("USER", "ADMIN")
                        // 그 외 API는 인증 필요 (작성/수정/삭제 등)
                        .requestMatchers("/api/**").authenticated()
                        // 나머지는 일단 허용 (정적 리소스, 프론트 등)
                        .anyRequest().permitAll()
                )
                // JWT로 처리하기 위해 기본 로그인 폼, HTTP Basic 비활성화
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                )
                // UsernamePasswordAuthenticationFilter 전에 JWT 필터를 끼워넣기
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 비밀번호 암호화에 사용
        return new BCryptPasswordEncoder();
    }
}
