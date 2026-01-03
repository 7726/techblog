import "./globals.css";
import Header from "@/components/Header"; // 👈 새로 만든 헤더 임포트

export const metadata = {
  title: "TechBlog | 윤지호",
  description: "Spring Boot & Next.js 16 기반 기술 블로그",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
        
        {/* 클라이언트 컴포넌트로 분리된 헤더 사용 */}
        <Header />

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