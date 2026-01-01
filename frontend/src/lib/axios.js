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
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;