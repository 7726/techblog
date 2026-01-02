'use client'; // 👈 클라이언트 컴포넌트 선언 (Hooks 사용을 위해 필수)

import { useEffect, useState } from 'react';
import Link from "next/link";
import api from "@/lib/axios";

export default function Home() {
  const [posts, setPosts] = useState([]); // 게시글 담을 곳
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 페이지 로드 시 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // 백엔드 API 호출 (GET http://localhost:8080/api/posts)
        // 주의: 백엔드 Controller 주소가 '/api/posts'가 맞는지 확인 필요!
        const response = await api.get('/posts'); 
        
        console.log("백엔드 응답 데이터:", response.data); // 👈 브라우저 개발자 도구(F12) Console에서 확인 가능
        
        // 백엔드 응답 구조에 따라 수정이 필요할 수 있습니다.
        // 예: response.data.content (Page 객체인 경우) 또는 response.data (List인 경우)
        // 일단 List로 가정하고 넣습니다.
        setPosts(response.data.content); 
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 1. 로딩 중일 때 보여줄 화면
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-xl font-semibold text-slate-500 animate-pulse">
          데이터를 불러오는 중입니다... ⏳
        </div>
      </div>
    );
  }

  // 2. 에러 났을 때 보여줄 화면
  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-red-500 font-bold text-xl">앗! 오류가 발생했어요. 😭</div>
        <p className="text-slate-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700 transition"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  // 3. 데이터가 없을 때 (게시글 0개)
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-700">아직 작성된 글이 없어요. 📝</h2>
        <p className="text-slate-500 mt-2">첫 번째 글의 주인공이 되어보세요!</p>
      </div>
    );
  }

  // 4. 정상 화면 (리스트 출력)
  return (
    <div className="space-y-16">
      
      {/* 히어로 섹션 */}
      <section className="text-center py-10 md:py-16 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          기록이 성장이 되는 공간,<br />
          <span className="text-blue-600">DevLog</span> 입니다.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          백엔드 개발자 윤지호의 기술 블로그입니다.<br className="hidden md:block"/>
          새로운 기술을 배우고 적용하며 겪은 경험들을 공유합니다.
        </p>
      </section>

      {/* 게시글 목록 */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">최신 글 ({posts.length})</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="group flex flex-col justify-between h-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {/* 카테고리가 있으면 표시, 없으면 기본값 */}
                    {post.categoryName || 'General'}
                  </span>
                  {/* 날짜 포맷팅 (YYYY-MM-DD) */}
                  <time>{post.createdDate ? new Date(post.createdDate).toLocaleDateString() : '날짜 없음'}</time>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  <Link href={`/posts/${post.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {/* 내용 요약이 있다면 표시, 없으면 본문 일부 */}
                  {post.content ? post.content.substring(0, 100) + '...' : '내용 없음'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                자세히 읽기 &rarr;
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}