package com.jyo.techblog.file;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;

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
     * - 응답: { "url": "/files/2025/12/03/xxx.jpg" }
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

    /**
     * 이미지 조회
     */
    @GetMapping("files/{year}/{month}/{day}/{filename:.+}")
    public ResponseEntity<Resource> getImage(
            @PathVariable String year,
            @PathVariable String month,
            @PathVariable String day,
            @PathVariable String filename
    ) throws IOException {

        Path rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path filePath = rootPath.resolve(Paths.get(year, month, day, filename));

        if (!Files.exists(filePath)) {
            throw new NoSuchFileException(filePath.toString());
        }

        Resource resource = new UrlResource(filePath.toUri());

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            // 이미지지만 타입 감지가 안 될 수도 있으니 기본값
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
