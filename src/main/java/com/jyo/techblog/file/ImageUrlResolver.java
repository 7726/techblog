package com.jyo.techblog.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 저장된 이미지의 상대 경로를 실제 접근 가능한 URL로 변환해주는 헬퍼
 */
@Component
public class ImageUrlResolver {

    @Value("${app.upload.url-prefix}")
    private String urlPrefix;  // ex) "/files"

    public String resolveUrl(String relativePath) {
        // 최종 URL: /files/2025/12/02/파일명.jpg
        String prefix = urlPrefix.endsWith("/")
                ? urlPrefix.substring(0, urlPrefix.length() - 1) : urlPrefix;
        return prefix + "/" + relativePath;
    }
}
