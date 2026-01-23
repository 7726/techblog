package com.jyo.techblog.domain.post;

import com.jyo.techblog.common.util.IpUtils;
import com.jyo.techblog.domain.post.dto.PostCreateRequest;
import com.jyo.techblog.domain.post.dto.PostResponse;
import com.jyo.techblog.domain.post.dto.PostUpdateRequest;
import com.jyo.techblog.domain.postview.PostViewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 게시글 API 컨트롤러
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class postController {

    private final PostService postService;
    private final PostViewService postViewService;

    /**
     * 게시글 작성 (로그인 필요)
     */
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            Authentication authentication,
            @Valid @RequestBody PostCreateRequest request
    ) {
        Long userId = (Long) authentication.getPrincipal();

        PostResponse response = postService.createPost(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 게시글 단건 조회 (공개)
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String ip = IpUtils.getClientIp(request);

        // 조회수 증가 (같은 IP면 쿨타임 적용)
        postViewService.increaseViewCountIfNeeded(id, ip);

        PostResponse response = postService.getPost(id);
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 목록 조회 (공개) + 간단 검색
     * - /api/posts
     * - /api/posts?keyword=스프링
     */
    @GetMapping
    public ResponseEntity<Page<PostResponse>> getPosts(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        Page<PostResponse> responses = postService.getPosts(keyword, categoryId, pageable);
        return ResponseEntity.ok(responses);
    }

    /**
     * 게시글 수정 (작성자 본인 or ADMIN)
     */
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest request
    ) {
        Long userId = (Long) authentication.getPrincipal();
        boolean isAdmin = isAdmin(authentication);

        PostResponse response = postService.updatePost(userId, isAdmin, id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 삭제 (작성자 본인 or ADMIN)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            Authentication authentication,
            @PathVariable Long id
    ) {
        Long userId = (Long) authentication.getPrincipal();
        boolean isAdmin = isAdmin(authentication);

        postService.deletePost(userId, isAdmin, id);
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN"));
    }
}
