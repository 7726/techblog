import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "TechBlog | 윤지호",
  description: "Spring Boot & Next.js 16 기반 기술 블로그",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
        
        {/* 헤더: 스크롤 시 상단 고정 + 블러 효과 */}
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
              <Link 
                href="/login" 
                className="hidden md:inline-flex px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                로그인
              </Link>
            </nav>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10 md:px-8">
          {children}
        </main>

        {/* 푸터 */}
        <footer className="border-t border-slate-200 bg-white py-10 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Yoon Ji-ho. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Built with Java Spring Boot 3.4 & Next.js 16
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}