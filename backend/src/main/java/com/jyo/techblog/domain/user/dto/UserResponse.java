package com.jyo.techblog.domain.user.dto;

import com.jyo.techblog.domain.user.Role;
import com.jyo.techblog.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 회원 응답 DTO
 */
@Getter
@AllArgsConstructor(staticName = "of")
public class UserResponse {

    private Long id;
    private String email;
    private String nickname;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserResponse from(User user) {
        return UserResponse.of(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

}
