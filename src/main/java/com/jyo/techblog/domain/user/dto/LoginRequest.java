package com.jyo.techblog.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * 로그인 요청 DTO
 */
@Getter
@Setter
public class LoginRequest {

    @Email
    @NotBlank(message = "이메일을 입력해 주세요.")
    private String email;

    @NotBlank(message = "패스워드를 입력해 주세요.")
    private String password;
}
