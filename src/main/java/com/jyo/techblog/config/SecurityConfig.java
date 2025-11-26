package com.jyo.techblog.config;

import com.jyo.techblog.auth.JwtAccessDeniedHandler;
import com.jyo.techblog.auth.JwtAuthenticationEntryPoint;
import com.jyo.techblog.auth.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                        // H2 콘솔
                        .requestMatchers("/h2-console/**").permitAll()
                        // 인증/회원가입 API는 모두 허용
                        .requestMatchers("/api/auth/**").permitAll()
                        // 그 외 API는 인증 필요
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
