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
        String email = authentication.getName();

        // postId는 URL, content는 body에서 받아서 서비스로 전달
        return commentService.create(email, postId, request);
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
        String email = authentication.getName();
        return commentService.update(id, email, request);
    }

    /**
     * 댓글 삭제
     * - URL: DELETE /comments/{id}
     */
    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        commentService.delete(id, email);
    }

}
