package com.jyo.techblog.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 로그인 응답 DTO
 * - accessToken: 이후 요청에서 Authorization 헤더로 보낼 JWT
 * - user: 로그인한 유저의 정보
 */
@Getter
@AllArgsConstructor(staticName = "of")
public class LoginResponse {

    private final String accessToken;
    private final UserResponse user;
}
