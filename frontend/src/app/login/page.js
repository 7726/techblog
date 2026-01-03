'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  
  // 입력 폼 상태 관리
  const [formData, setFormData] = useState({
    email: '',    // LoginRequest DTO 필드명 확인 필요 (email 혹은 username)
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 로그인 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 백엔드 로그인 API 호출 (PostController가 아니라 AuthController 확인 필요)
      const response = await api.post('/auth/login', formData);

      // 응답에서 토큰 추출 (LoginResponse 구조에 따라 다를 수 있음)
      // 예: { accessToken: "...", tokenType: "Bearer" }
      const { accessToken } = response.data;

      if (!accessToken) {
        throw new Error('토큰을 받아오지 못했습니다.');
      }

      // 로컬 스토리지에 토큰 저장
      localStorage.setItem('accessToken', accessToken);

      // 로그인 성공 시 메인으로 이동 (새로고침 효과를 위해 window.location 사용 가능)
      window.location.href = '/'; 
      
    } catch (err) {
      console.error('로그인 에러:', err);
      // 백엔드 에러 메시지가 있다면 보여주기
      const msg = err.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        
        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">관리자 로그인</h1>
          <p className="text-sm text-slate-500">
            블로그 주인장만 입장할 수 있습니다. 🔐
          </p>
        </div>

        {/* 로그인 폼 */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">이메일</label>
              <input
                id="email"
                name="email"
                type="email" // 만약 username을 쓴다면 type="text"로 변경
                required
                className="relative block w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="이메일 주소"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-lg border border-slate-300 px-3 py-3 text-slate-900 placeholder-slate-400 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-sm text-red-500 text-center font-medium bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '로그인 중...' : '로그인 하기'}
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}