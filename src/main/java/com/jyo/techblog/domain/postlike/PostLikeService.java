package com.jyo.techblog.domain.postlike;

import com.jyo.techblog.domain.post.PostRepository;
import com.jyo.techblog.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
}
