package com.jyo.techblog.file;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.UUID;

/**
 * 이미지 파일을 로컬 디렉토리에 저장하고, 접근 가능한 URL을 반환하는 서비스
 */
@Service
@RequiredArgsConstructor
public class ImageStorageService {

    private final ImageUrlResolver imageUrlResolver;

    @Value("${app.upload.dir}")
    private String uploadDir;  // ex) "uploads"

    /**
     * 이미지 파일 저장 후 접근 URL 반환
     */
    public String storeImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어 있습니다.");
        }

        // MIME 타입 체크 (image/* 인지만 간단히 확인)
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
        }

        // 날짜별 디렉토리 분리 (예: uploads/2025/12/02)
        LocalDate today = LocalDate.now();
        Path basePath = Paths.get(uploadDir,
                String.valueOf(today.getYear()),
                String.format("%02d", today.getMonthValue()),
                String.format("%02d", today.getDayOfMonth()));

        Files.createDirectories(basePath);

        // 파일명: UUID + 기존 확장자
        String originalFilename = file.getOriginalFilename();
        String ext = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }

        String savedFileName = UUID.randomUUID() + ext;
        Path targetPath = basePath.resolve(savedFileName);

        // 실제 파일 저장
        file.transferTo(targetPath.toFile());

        // 클라이언트에서 접근할 수 있는 URL 생성
        String relativePath = String.join("/",
                String.valueOf(today.getYear()),
                String.format("%02d", today.getMonthValue()),
                String.format("%02d", today.getDayOfMonth()),
                savedFileName
        );

        return imageUrlResolver.resolveUrl(relativePath);
    }

}
