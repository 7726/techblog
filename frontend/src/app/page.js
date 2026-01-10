'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import api from "@/lib/axios";

// useSearchParams를 사용하는 컴포넌트는 Suspense로 감싸야 함
export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">로딩 중...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 파라미터 읽기
  const currentKeyword = searchParams.get('keyword') || '';
  const currentCategory = searchParams.get('categoryId') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // 상태 관리
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 검색어 입력 상태
  const [searchTerm, setSearchTerm] = useState(currentKeyword);

  // 1. 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('카테고리 로딩 실패:', err);
      }
    };
    fetchCategories();
  }, []);

  // 2. 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage - 1,
          size: 9,
          sort: 'createdAt,desc',
        };

        if (currentKeyword) params.keyword = currentKeyword;
        if (currentCategory) params.categoryId = currentCategory;

        const response = await api.get('/posts', { params });
        
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, currentKeyword, currentCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ keyword: searchTerm, page: 1 });
  };

  const handleCategoryClick = (categoryId) => {
    setSearchTerm(''); 
    updateParams({ categoryId: categoryId, keyword: '', page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
  };

  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* 사이드바 (카테고리) */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
          <h3 className="font-bold text-slate-900 mb-4 text-lg">Categories</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleCategoryClick('')}
                className={`w-full text-left px-3 py-2 rounded-md transition text-sm font-medium ${
                  !currentCategory 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                전체보기
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition text-sm font-medium ${
                    currentCategory === String(cat.id)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 space-y-8">
        
        {/* 검색바 & 정보 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {currentCategory 
                ? `${categories.find(c => String(c.id) === currentCategory)?.name || 'Category'} 글 목록` 
                : currentKeyword 
                  ? `'${currentKeyword}' 검색 결과` 
                  : '전체 글 목록'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              총 <span className="font-semibold text-blue-600">{totalElements}</span>개의 글이 있습니다.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="검색어를 입력하세요..." 
              className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-blue-500 text-sm transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
            >
              🔍
            </button>
          </form>
        </div>

        {/* 게시글 리스트 */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">데이터를 불러오는 중입니다... ⏳</div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-lg text-slate-600">조건에 맞는 게시글이 없습니다. 😢</p>
            {(currentKeyword || currentCategory) && (
              <button 
                onClick={() => updateParams({ keyword: '', categoryId: '', page: 1 })}
                className="mt-4 text-blue-600 hover:underline text-sm"
              >
                전체 목록으로 돌아가기
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {post.categoryName || 'General'}
                    </span>
                    <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    <Link href={`/posts/${post.id}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed h-16 overflow-hidden">
                    {post.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              &lt; 이전
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
              .map((page, index, array) => (
                <span key={page} className="flex">
                  {index > 0 && page !== array[index - 1] + 1 && <span className="px-2">...</span>}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                </span>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              다음 &gt;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}