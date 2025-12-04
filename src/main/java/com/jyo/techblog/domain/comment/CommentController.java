package com.jyo.techblog.domain.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 작성
     */

    /**
     * 댓글 목록 조회 (비로그인도 조회 가능)
     */

    /**
     * 댓글 수정
     */

    /**
     * 댓글 삭제
     */
}
