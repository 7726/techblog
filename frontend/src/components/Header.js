'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // import 확인
import api from '@/lib/axios';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      // 일단 UI는 로그인된 상태로 보여줌 (깜빡임 방지)
      setIsLoggedIn(true);

      try {
        // [수정] 백엔드 엔드포인트 확인 (/api/users/me 가 맞는지 체크)
        // UserController에 @GetMapping("/me") 가 있으므로 맞음!
        await api.get('/users/me'); 
      } catch (err) {
        // 토큰 만료 또는 에러 발생 시
        console.log('세션 만료됨 (Silent Refresh):', err);
        localStorage.removeItem('accessToken'); // 토큰 삭제
        setIsLoggedIn(false); // 로그아웃 상태로 전환
        // 여기서도 alert나 이동은 안 함. (사용자 경험 보호)
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
      alert('로그아웃 되었습니다.');
      router.push('/');
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      {/* ... (기존 JSX 구조 유지) ... */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition">
          <span className="text-blue-600">Dev</span>Log
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">소개</Link>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/categories" 
                className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                카테고리 관리
              </Link>
              <Link 
                href="/write" 
                className="hidden md:inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                글쓰기 🖊️
              </Link>
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-500 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="hidden md:inline-flex px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}