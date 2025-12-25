package com.jyo.techblog.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentCreateRequest {

    // 댓글 내용만 받기 (postId는 URL에서 받음)
    @NotBlank(message = "댓글 내용은 필수입니다.")
    private String content;  // 댓글 내용

    // 비회원 정보 (로그인 시엔 null로 들어옴)
    private String authorName;
    private String password;
}
