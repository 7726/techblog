package com.jyo.techblog.domain.comment;

import com.jyo.techblog.domain.comment.dto.CommentCreateRequest;
import com.jyo.techblog.domain.comment.dto.CommentResponse;
import com.jyo.techblog.domain.comment.dto.CommentUpdateRequest;
import com.jyo.techblog.domain.post.Post;
import com.jyo.techblog.domain.post.PostRepository;
import com.jyo.techblog.domain.user.Role;
import com.jyo.techblog.domain.user.User;
import com.jyo.techblog.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 댓글 생성
     * - 회원 + 비회원 통합
     */
    @Transactional
    public CommentResponse create(Long userId, Long postId, CommentCreateRequest request) {
        // 1. 게시글 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        User user = null;
        String authorName = request.getAuthorName();
        String password = request.getPassword();

        // 2. 회원/비회원 분기 처리
        if (userId != null) {
            // 로그인한 회원
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            authorName = user.getNickname();  // 회원은 닉네임 자동 설정
            password = null;  // 회원은 비번 필요 없음
        } else {
            // 비회원 유효성 검사
            if (request.getAuthorName() == null || request.getPassword() == null) {
                throw new IllegalArgumentException("비회원은 닉네임과 비밀번호가 필수입니다.");
            }
            // 비밀번호 암호화 (BCrypt)
            password = passwordEncoder.encode(request.getPassword());
        }

        Comment comment = Comment.builder()
                .post(post)
                .user(user)  // 비회원이면 null
                .content(request.getContent())
                .authorName(authorName)
                .password(password)
                .build();

        return CommentResponse.from(commentRepository.save(comment));
    }

    /**
     * 댓글 수정
     * - 비회원 댓글 수정 로직은 추후 작업
     */
    @Transactional
    public CommentResponse update(Long commentId, Long userId, CommentUpdateRequest request) {
        // 활성 상태의 댓글 조회
        Comment comment = getActiveCommentOrThrow(commentId);

        // 회원 댓글인지 확인
        if (comment.getUser() != null) {
            // 작성자 본인인지 확인
            if (userId == null || !comment.getUser().getId().equals(userId)) {
                throw new IllegalStateException("본인 댓글만 수정할 수 있습니다.");
            }
        } else {
            // 비회원 댓글은 수정 불가 (추후 수정)
            throw new IllegalStateException("비회원 댓글은 수정할 수 없습니다. 삭제 후 다시 작성해주세요.");
        }

        // 내용 수정
        comment.updateContent(request.getContent());

        // 변경감지를 통해 자동 업데이트 -> 현재 엔티티 기준 DTO 변환
        return CommentResponse.from(comment);
    }

    /**
     * 댓글 삭제 (회원 + 비회원)
     * - rawPassword: 비회원이 입력한 삭제용 비밀번호 (회원은 null)
     */
    @Transactional
    public void delete(Long commentId, Long userId, String rawPassword) {
        // 활성 상태의 댓글 조회
        Comment comment = getActiveCommentOrThrow(commentId);

        // 관리자는 모든 댓글 삭제 가능
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getRole() == Role.ADMIN) {
                comment.softDelete();
                return;
            }
        }

        if (comment.getUser() != null) {
            // 회원 댓글인 경우: 본인 확인
            if (userId == null || !comment.getUser().getId().equals(userId)) {
                throw new IllegalArgumentException("본인 댓글만 삭제할 수 있습니다.");
            }
        } else {
            // 비회원 댓글인 경우: 비밀번호 검증
            if (rawPassword == null || !passwordEncoder.matches(rawPassword, comment.getPassword())) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }
        }

        comment.softDelete();
    }

    /**
     * 게시글 기준 댓글 목록 조회 (페이징)
     * - 삭제되지 않은 댓글만 조회
     */
    public Page<CommentResponse> getByPost(Long postId, Pageable pageable) {
        // 게시글 존재 여부 확인
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        // 댓글 목록 조회 후 DTO 변환
        return commentRepository.findByPostAndDeletedFalse(post, pageable)
                .map(CommentResponse::from);
    }

    /**
     * 삭제되지 않은 댓글만 조회하는 내부 유틸 메서드
     */
    private Comment getActiveCommentOrThrow(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (comment.isDeleted()) {
            throw new IllegalArgumentException("삭제된 댓글입니다.");
        }

        return comment;
    }
}
