package com.jyo.techblog.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 회원가입 요청 DTO
 */
@Getter
@Setter
public class RegisterRequest {

    @Email
    @NotBlank(message = "이메일은 공백일 수 없습니다.")
    private String email;

    @NotBlank(message = "패스워드는 공백일 수 없습니다.")
    @Size(min = 8, max = 100)
    private String password;

    @NotBlank(message = "닉네임은 공백일 수 없습니다.")
    private String nickname;
}
