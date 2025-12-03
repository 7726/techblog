package com.jyo.techblog.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * 로컬 파일 시스템에 저장된 이미지를 /files/** 경로로 서빙하는 설정
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("%{app.upload.dir}")
    private String uploadDir;  // 예: "uploads"

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 절대 경로로 변환
//        String absolutePath = Paths.get(uploadDir).toAbsolutePath().normalize().toString();
//        // 예: /files/** -> file:uploads/
//        registry.addResourceHandler("/files/**")
//                .addResourceLocations("file:" + absolutePath + "/");
    }
}
