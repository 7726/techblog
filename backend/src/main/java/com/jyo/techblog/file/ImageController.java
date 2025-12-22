package com.jyo.techblog.file;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 이미지 업로드 API
 */
@RestController
@RequiredArgsConstructor
@RequestMapping
public class ImageController {

    private final ImageStorageService imageStorageService;

    @Value("${app.upload.dir}")
    private String uploadDir;  // "uploads"

    /**
     * 이미지 업로드 (로그인 필요)
     * - 요청: multipart/form-data, key = "file"
     * - 응답: s3 URL
     */
    @PostMapping("/api/files/images")
    public ResponseEntity<ImageUploadResponse> uploadImage(
            Authentication authentication,
            @RequestParam("file")MultipartFile file
    ) throws IOException {
        String url = imageStorageService.storeImage(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ImageUploadResponse(url));
    }

    public record ImageUploadResponse(String url) {}
}
