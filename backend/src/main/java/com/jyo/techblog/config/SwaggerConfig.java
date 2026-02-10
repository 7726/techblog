package com.jyo.techblog.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;

public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        // 1. JWT 설정 (Authorize 버튼 생성)
        String jwtSchemeName = "JWT";
        SecurityRequirement securityRequirement = new SecurityRequirement().addList(jwtSchemeName);

        Components components = new Components()
                .addSecuritySchemes(jwtSchemeName, new SecurityScheme()
                        .name(jwtSchemeName)
                        .type(SecurityScheme.Type.HTTP) // HTTP 방식
                        .scheme("bearer")
                        .bearerFormat("JWT")); // 토큰 형식을 지정

        // 2. API 정보 설정
        return new OpenAPI()
                .info(apiInfo())
                .addSecurityItem(securityRequirement)
                .components(components);
    }

    private Info apiInfo() {
        return new Info()
                .title("Techblog API Documentation") // API 문서 제목
                .description("Techblog - FrontEnd & BackEnd 풀스택 프로젝트 API 명세서")
                .version("1.0.0");
    }

}
