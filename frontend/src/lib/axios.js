import axios from 'axios';

const api = axios.create({
  // Spring Boot 백엔드 주소 (로컬: 8080)
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 쿠키 공유
});

// 요청 인터셉터: Access Token이 있다면 헤더에 자동 주입
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (401 감지 시 조용히 토큰 삭제)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // 토큰이 만료되었거나 유효하지 않음 -> 토큰 삭제
        localStorage.removeItem('accessToken');
        
        // 🚨 [수정] 강제 이동 코드 삭제!
        // 사용자는 그냥 "어? 로그인이 풀렸네?" 하고 계속 글을 읽으면 됨.
        // (단, 로그인 페이지에서는 에러 메시지를 띄워주는 게 좋으므로 예외 처리 가능하지만 심플하게 감)
      }
    }
    return Promise.reject(error);
  }
);

export default api;