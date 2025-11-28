package com.jyo.techblog.common.error;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * API 공통 에러 응답 형식
 */
@Getter
@Builder
public class ErrorResponse {

    private int status;  // HTTP status
    private String error;  // BAD_REQUEST, UNAUTHORIZED 등
    private String message;  // 상세 메시지
    private String path;  // 요청 경로
    private LocalDateTime timestamp;  // 발생 시각
}
