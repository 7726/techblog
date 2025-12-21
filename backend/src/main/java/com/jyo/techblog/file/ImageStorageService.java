package com.jyo.techblog.file;

import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;


/**
 * 이미지 파일을 S3에 업로드 후 URL 반환
 */
@Service
@RequiredArgsConstructor
public class ImageStorageService {

    private final S3Template s3Template;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    // S3에 이미지 업로드 후 URL 반환
    public String storeImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어 있습니다.");
        }

        // 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }

        // S3에 저장될 파일명 (UUID 사용) -> "images/uuid.jpg" 경로로 저장
        String storeFileName = "images/" + UUID.randomUUID() + ext;

        // S3 업로드 (InputStream 방식)
        s3Template.upload(bucketName, storeFileName, file.getInputStream());

        // 업로드된 파일의 전체 URL 반환
        // (S3Template이 자동으로 URL을 만들어주긴 하지만, 리전별 형식이 다를 수 있어 직접 조합이 확실할 때가 많음)
        // 일단 s3Template.download(bucket, key).getURL() 기능도 있지만
        // public 읽기 권한을 줬다면 아래처럼 URL을 바로 만드는 게 효율적임
        return String.format("https://%s.s3.ap-northeast-2.amazonaws.com/%s", bucketName, storeFileName);
    }

}
