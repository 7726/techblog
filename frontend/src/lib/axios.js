import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', // 백엔드 API 주소
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 요청 시 인증 정보(쿠키 등)를 함께 보냄 (필수!)
});

export default api;