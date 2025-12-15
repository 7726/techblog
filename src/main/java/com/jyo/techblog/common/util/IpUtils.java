package com.jyo.techblog.common.util;

import jakarta.servlet.http.HttpServletRequest;

public final class IpUtils {

    private IpUtils() {
    }

    public static String getClientIp(HttpServletRequest request) {
        // 1) 프록시 환경에서 많이 쓴느 헤더 우선
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            String ip = xff.split(",")[0].trim();
            return normalizeLoopback(ip);
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return normalizeLoopback(xRealIp.trim());
        }

        // 2) 프록시 없으면 여기로 떨어짐 (로컬에서는 대부분 loopback)
        return normalizeLoopback(request.getRemoteAddr());
    }

    private static String normalizeLoopback(String ip) {
        // IPv6 loopback -> IPv4 loopback으로 보기 좋게 변환
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) {
            return "127.0.0.1";
        }
        return ip;
    }
}
