package com.jyo.techblog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);  // 자격 증명(쿠키, 인증 헤더 등) 허용
        config.addAllowedOrigin("http://localhost:3000");  // 프론트엔드 주소만 허용
        config.addAllowedHeader("*");  // 모든 헤더 허용
        config.addAllowedMethod("*");  // GET, POST, PUT, DELETE 등 모든 메서드 허용

        source.registerCorsConfiguration("/api/**", config);  // /api/** 경로에 대해 적용
        return new CorsFilter(source);
    }
}
