import { Inter } from "next/font/google"; // 가독성 좋은 영문 폰트
import "./globals.css";
import Link from "next/link";

// 한글 폰트 적용을 원하시면 'next/font/google' 대신 로컬 폰트나 CDN을 쓸 수도 있지만, 
// 일단 기본 폰트로 깔끔하게 갑니다.
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jiho's TechBlog",
  description: "Spring Boot & Next.js Tech Blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* 상단 네비게이션 바 */}
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
            
            {/* 로고 영역 */}
            <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
              Tech<span className="text-blue-600">Blog</span>.
            </Link>

            {/* 우측 메뉴 (로그인/글쓰기 등) */}
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                로그인
              </Link>
              <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700">
                글쓰기
              </button>
            </div>
          </div>
        </nav>

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1">
          {children}
        </main>

        {/* 푸터 */}
        <footer className="border-t border-slate-200 bg-white py-10">
          <div className="mx-auto max-w-5xl px-6 text-center text-sm text-slate-500">
            © 2026 Jiho Yoon. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}