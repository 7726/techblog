'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
// import Header from '@/components/Header'; // ❌ [삭제] layout.js에 이미 있으므로 제거

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ [복구] 카테고리 목록
  const [selectedCategory, setSelectedCategory] = useState(null); // ✅ [복구] 선택된 카테고리
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  // 1. 초기 데이터 로딩 (카테고리 + 전체 글)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 카테고리 & 게시글 병렬 요청
        const [catRes, postRes] = await Promise.all([
          api.get('/categories'),
          api.get('/posts')
        ]);
        
        setCategories(catRes.data);
        setPosts(postRes.data.content);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. 게시글 필터링 (검색어 + 카테고리)
  const fetchPosts = async (searchKeyword, categoryId) => {
    try {
      setLoading(true);
      const params = {};
      if (searchKeyword) params.keyword = searchKeyword;
      if (categoryId) params.categoryId = categoryId;

      const response = await api.get('/posts', { params });
      setPosts(response.data.content);
    } catch (err) {
      console.error('게시글 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(keyword, selectedCategory);
  };

  // ✅ [복구] 카테고리 클릭 핸들러
  const handleCategoryClick = (id) => {
    // 이미 선택된 거 누르면 해제(전체보기), 아니면 선택
    const nextCategory = id === selectedCategory ? null : id;
    setSelectedCategory(nextCategory);
    fetchPosts(keyword, nextCategory);
  };

  // ✅ [유지] HTML 태그 제거 및 말줄임 처리 함수
  const stripHtmlAndTruncate = (html, maxLength = 100) => {
    if (!html) return '';
    const text = html.replace(/<[^>]*>?/gm, ''); // 태그 제거
    const cleanText = text.replace(/&nbsp;/g, ' ').trim(); // 공백 문자 제거
    if (cleanText.length > maxLength) {
      return cleanText.substring(0, maxLength) + '...';
    }
    return cleanText;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header 컴포넌트 제거 (layout.js에서 처리됨) */}

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* 상단 타이틀 & 검색창 */}
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Dev<span className="text-blue-600">Log</span>
          </h1>
          <p className="text-slate-500 text-lg">개발 지식과 경험을 공유하는 공간입니다.</p>
          
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mt-6">
            <input 
              type="text"
              placeholder="검색어를 입력하세요..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <button 
              type="submit"
              className="absolute right-3 top-2.5 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition"
            >
              🔍
            </button>
          </form>
        </div>

        {/* ✅ [복구] 카테고리 필터 버튼 영역 */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              selectedCategory === null
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 게시글 리스트 */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">로딩 중... ⏳</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link 
                  href={`/posts/${post.id}`} 
                  key={post.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full"
                >
                  <div className="h-2 bg-blue-600 w-0 group-hover:w-full transition-all duration-500" />
                  
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {post.categoryName || 'General'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* ✅ [적용됨] 태그 제거된 본문 미리보기 */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 break-keep">
                      {stripHtmlAndTruncate(post.content, 120)}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>by {post.authorName || 'Admin'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>👀 {post.viewCount}</span>
                        {/* 좋아요 수 표시가 필요하다면 post.likeCount 사용 */}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
                <p>게시글이 없습니다. 텅 비었네요! 🍃</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}