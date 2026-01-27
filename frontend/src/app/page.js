'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  
  // ✅ [추가] 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (0부터 시작)
  const [totalPages, setTotalPages] = useState(0);   // 전체 페이지 수

  // 1. 초기 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 초기 로딩 시에는 0번 페이지 요청
        const [catRes, postRes] = await Promise.all([
          api.get('/categories'),
          api.get('/posts?page=0&size=10') 
        ]);
        
        setCategories(catRes.data);
        setPosts(postRes.data.content);
        // ✅ [추가] 전체 페이지 수 저장 (Spring Page 객체 구조: totalPages)
        setTotalPages(postRes.data.totalPages);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. 게시글 데이터 가져오기 (검색, 카테고리, 페이지 이동 공용)
  // ✅ [수정] page 파라미터 추가
  const fetchPosts = async (page, searchKeyword, categoryId) => {
    try {
      setLoading(true);
      const params = {
        page: page, // 요청할 페이지 번호
        size: 10,   // 페이지당 글 개수
      };
      
      if (searchKeyword) params.keyword = searchKeyword;
      if (categoryId) params.categoryId = categoryId;

      const response = await api.get('/posts', { params });
      
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages); // ✅ [추가] 전체 페이지 수 업데이트
      setCurrentPage(page); // ✅ [추가] 현재 페이지 상태 업데이트
    } catch (err) {
      console.error('게시글 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 시에는 무조건 0페이지부터 시작
    fetchPosts(0, keyword, selectedCategory);
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (id) => {
    const nextCategory = id === selectedCategory ? null : id;
    setSelectedCategory(nextCategory);
    // 카테고리 변경 시에도 0페이지부터 시작
    fetchPosts(0, keyword, nextCategory);
  };

  // ✅ [추가] 페이지 번호 클릭 핸들러
  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return; // 범위 벗어나면 무시
    fetchPosts(newPage, keyword, selectedCategory);
    
    // 페이지 이동 시 상단으로 스크롤 부드럽게 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // HTML 태그 제거 및 말줄임 처리 함수
  const stripHtmlAndTruncate = (html, maxLength = 100) => {
    if (!html) return '';
    const text = html.replace(/<[^>]*>?/gm, '');
    const cleanText = text.replace(/&nbsp;/g, ' ').trim();
    if (cleanText.length > maxLength) {
      return cleanText.substring(0, maxLength) + '...';
    }
    return cleanText;
  };

  return (
    <div className="min-h-screen bg-slate-50">
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

        {/* 카테고리 필터 버튼 영역 */}
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
          <>
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

                      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 break-keep">
                        {stripHtmlAndTruncate(post.content, 120)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>by {post.nickname || 'Admin'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>👀 {post.viewCount}</span>
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

            {/* ✅ [추가] 페이지네이션 버튼 UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {/* 이전 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    currentPage === 0
                      ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-300'
                  }`}
                >
                  &lt; 이전
                </button>

                {/* 페이지 번호들 (단순하게 1부터 끝까지 나열) */}
                {/* 게시글이 아주 많아지면 '1 ... 5 6 7 ... 10' 처럼 로직 변경 필요하지만 지금은 전체 표시 */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      currentPage === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* 다음 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    currentPage === totalPages - 1
                      ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-300'
                  }`}
                >
                  다음 &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}