package com.jyo.techblog.file;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 이미지 업로드 API
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class ImageController {

    private final ImageStorageService imageStorageService;

}
