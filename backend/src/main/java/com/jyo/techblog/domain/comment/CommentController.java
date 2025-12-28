package com.jyo.techblog.domain.comment;

import com.jyo.techblog.domain.comment.dto.CommentCreateRequest;
import com.jyo.techblog.domain.comment.dto.CommentResponse;
import com.jyo.techblog.domain.comment.dto.CommentUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 작성
     * - URL: POST /posts/{postId}/comments
     * - body: { "content": "댓글 내용" }
     */
    @PostMapping("/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse create(
            @PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequest request,
            Authentication authentication
    ) {
        // jWT에서 이메일 꺼내기
        Long userId = getUserId(authentication);

        // postId는 URL, content는 body에서 받아서 서비스로 전달
        return commentService.create(userId, postId, request);
    }

    /**
     * 댓글 목록 조회 (비로그인도 조회 가능)
     * - URL: GET /posts/{postId}/comments?page=0&size=10
     */
    @GetMapping("/posts/{postId}/comments")
    public Page<CommentResponse> getByPost(
            @PathVariable Long postId,
            Pageable pageable
    ) {
        return commentService.getByPost(postId, pageable);
    }

    /**
     * 댓글 수정
     * - URL: PATCH /comments/{id}
     */
    @PatchMapping("/comments/{id}")
    public CommentResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateRequest request,
            Authentication authentication
    ) {
        Long userId = getUserId(authentication);
        return commentService.update(id, userId, request);
    }

    /**
     * 댓글 삭제 (수정됨: 비회원 비밀번호 받기 추가)
     * - URL: DELETE /comments/{id}
     * - Body: { "password": "..." } (비회원일 경우)
     */
    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody(required = false) Map<String, String> requestBody
    ) {
        Long userId = getUserId(authentication);

        // Body에서 비밀번호 꺼내기 (없으면 null)
        String password = (requestBody != null) ? requestBody.get("password") : null;

        commentService.delete(id, userId, password);
    }

    private Long getUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String name = authentication.getName();
        if ("anonymousUser".equals(name)) {
            return null;
        }
        // 토큰에 있는 ID(String)를 Long으로 변환
        return Long.parseLong(name);
    }

}
