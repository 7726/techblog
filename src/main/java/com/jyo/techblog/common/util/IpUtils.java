package com.jyo.techblog.common.util;

import jakarta.servlet.http.HttpServletRequest;

public final class IpUtils {

    private IpUtils() {
    }

    // 간단 버전: 프록시 고려해서 X-Forwarded-For 우선 사용
    public static String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // "client, proxy1, proxy2" 형태일 수 있어서 첫 번째 값 사용
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
