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
import org.springframework.web.bind.annotation.*;
import java.util.Map; // Map 추가

@RestController
@RequiredArgsConstructor
@RequestMapping // URL 매핑은 메서드 단위로 되어 있어서 여기 비워둬도 됨
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 작성
     * - URL: POST /posts/{postId}/comments
     */
    @PostMapping("/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse create(
            @PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequest request,
            Authentication authentication
    ) {
        String email = getEmailFromAuth(authentication);
        return commentService.create(email, postId, request);
    }

    /**
     * 댓글 목록 조회
     * - URL: GET /posts/{postId}/comments
     */
    @GetMapping("/posts/{postId}/comments")
    public Page<CommentResponse> getByPost(
            @PathVariable Long postId,
            Pageable pageable
    ) {
        return commentService.getByPost(postId, pageable);
    }

    /**
     * 댓글 수정 (일단 회원 로직 위주, 비회원 수정은 추후 고려)
     * - URL: PATCH /comments/{id}
     */
    @PatchMapping("/comments/{id}")
    public CommentResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CommentUpdateRequest request,
            Authentication authentication
    ) {
        String email = getEmailFromAuth(authentication);
        return commentService.update(id, email, request);
    }

    /**
     * 댓글 삭제 (비회원 비밀번호 지원)
     * - URL: DELETE /comments/{id}
     * - Body에 {"password": "1234"} 가 들어올 수 있음
     */
    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody(required = false) Map<String, String> requestBody // 비번 받기 위해 추가
    ) {
        String email = getEmailFromAuth(authentication);

        // Body에서 비밀번호 꺼내기 (없으면 null)
        String password = (requestBody != null) ? requestBody.get("password") : null;

        commentService.delete(id, email, password);
    }

    // 💡 인증 객체에서 안전하게 이메일 꺼내는 유틸 메서드
    private String getEmailFromAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String name = authentication.getName();
        // 스프링 시큐리티는 로그인 안 하면 "anonymousUser"라는 문자열을 줌 -> 이걸 null로 바꿔야 로직이 편함
        if ("anonymousUser".equals(name)) {
            return null;
        }
        return name;
    }
}