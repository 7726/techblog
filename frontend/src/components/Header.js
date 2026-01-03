'use client'; // 👈 클라이언트 컴포넌트 필수 선언

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 페이지가 로드되거나 경로가 바뀔 때마다 토큰 확인
  useEffect(() => {
    // localStorage에서 토큰이 있는지 확인
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // 토큰이 있으면 true, 없으면 false
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('accessToken'); // 토큰 삭제
      setIsLoggedIn(false);
      alert('로그아웃 되었습니다.');
      router.push('/'); // 메인으로 이동
      window.location.reload(); // 상태 반영을 위해 새로고침
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition">
          <span className="text-blue-600">Dev</span>Log
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">소개</Link>
          
          {/* 로그인 상태에 따라 버튼 바꾸기 */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
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