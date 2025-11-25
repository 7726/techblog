package com.jyo.techblog.auth;

import com.jyo.techblog.domain.user.Role;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * 매 요청마다 JWT 토큰을 검사해서 인증 정보를 세팅하는 필터
 * - 사용자가 보낸 Authorization 헤더에 JWT 토큰이 있는지 확인하고
 * - 토큰이 유효하면 인증 정보를 SecurityContext에 넣어주는 역할을 한다
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1) HTTP 요청 헤더 중 Authorization 값을 가져온다. (ex. Bearer eyJhbGciOiJIUzI1NiJ9....)
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // 2) Authorization 헤더가 존재하고 "Bearer " 로 시작하는지 확인
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 3) "Bearer " 자르고 실제 JWT 토큰만 가져옴
            String token = authHeader.substring(7);

            // 4) 토큰이 유효한지 검증 (서명 체크, 만료시간 체크 등)
            if (jwtTokenProvider.validateToken(token)) {
                // 5) 토큰 내부에서 userId, Role 추출 (JWT 클레임 안에 저장해둔 값)
                Long userId = jwtTokenProvider.getUserId(token);
                Role role = jwtTokenProvider.getRole(token);

                // 6) Spring Security는 권한을 "ROLE_이름" 형태로 관리한다.
                // - ex) USER -> ROLE_USER
                // - List<GrantedAuthority> 형태로 Security에게 넘겨줘야 한다.
                List<GrantedAuthority> authorities =
                        List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));

                /**
                 * 7) Authentication 객체 생성
                 *
                 * UsernamePasswordAuthenticationToken(principal, credentials, authorities)
                 *
                 * - principal : "사용자 식별 정보"
                 *              보통 UserDetails 객체를 넣지만, 지금은 userId만 넣어서 간단하게 구성
                 * - credentials : 비밀번호 같은 인증 정보 (JWT 인증에서는 필요 없으므로 null)
                 * - authorities : 사용자의 권한 목록 (ROLE_USER 등)
                 *
                 * 이 Authentication 객체가 "이 유저는 인증됨" 이라는 증거가 됨
                 */
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userId,         // principal
                        null,           // credentials (비밀번호)
                        authorities
                );

                /**
                 * 8) SecurityContextHolder 에 인증 정보 넣기
                 *
                 * Spring Security는 내부적으로 "현재 요청" 의 인증 정보를 SecurityContextHolder에 저장해둔다.
                 *
                 * 컨트롤러에서 Authentication 파라미터로 값을 받을 때 여기 저장된 정보가 들어감
                 */
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        /**
         * 9) 다음 필터로 요청을 넘김
         * - 필터 체인 방식이라 인증 필터만 있는게 아님
         * - SecurityFilterChain 내의 다른 필터들도 계속 수행됨
         * - 인증했다면 그 다음 인가(권한 체크)가 적용됨
         */
        filterChain.doFilter(request, response);
    }

}
