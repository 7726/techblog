package com.jyo.techblog.domain.user;

import com.jyo.techblog.common.BaseTimeEntity;
import com.jyo.techblog.domain.post.Post;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 블로그 회원 엔티티
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "users")  // user는 예약어일 수 있기 때문에 users로
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;  // 로그인 ID

    @Column(nullable = false)
    private String password;  // BCrypt로 해시된 비밀번호

    @Column(nullable = false, length = 50)
    private String nickname;  // 블로그에 표시될 이름

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;  // USER, ADMIN

    @OneToMany(mappedBy = "author")
    @Builder.Default
    private List<Post> posts = new ArrayList<>();

    //== 정적 팩토리 메서드 ==//
    public static User createUser(String email, String encodedPassword, String nickname, Role role) {
        User user = new User();
        user.email = email;
        user.password = encodedPassword;
        user.nickname = nickname;
        user.role = role;
        return user;
    }

    // 비밀번호 변경 등 도메인 메서드는 필요해지면 추가 예정
}
