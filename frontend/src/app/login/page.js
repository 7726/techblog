'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios'; // 방금 만든 axios 도구 가져오기

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // 에러 메시지 초기화

    try {
      // 1. 백엔드로 로그인 요청 (/api/auth/login)
      const response = await api.post('/api/auth/login', {
        email: email,
        password: password
      });

      // 2. 받은 토큰(Access Token) 저장 (일단 로컬 스토리지에 저장)
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      
      // 3. 환영 인사 및 메인으로 이동
      alert(`${user.nickname}님 환영합니다!`);
      router.push('/'); // 메인 페이지로 이동

    } catch (err) {
      console.error('로그인 실패:', err);
      // 에러 메시지 보여주기
      if (err.response && err.response.data) {
        // 백엔드에서 보낸 에러 메시지가 있으면 보여줌
        setError(err.response.data.message || '로그인에 실패했습니다.');
      } else {
        setError('서버와 통신할 수 없습니다.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-black">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">로그인</h2>
        
        {/* 에러 메시지 박스 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}