package com.jyo.techblog.domain.postlike.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostLikeResponse {

    // 해당 게시글의 전체 좋아요 수 (deleted = false 기준)
    private long likeCount;

    // 현재 요청 주체 (회원 or 비회원 IP)가 이미 좋아요를 눌렀는지 여부
    private boolean likedByMe;

    public static PostLikeResponse of(long likeCount, boolean likedByMe) {
        return new PostLikeResponse(likeCount, likedByMe);
    }
}
