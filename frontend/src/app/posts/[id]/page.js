'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import CommentSection from '@/components/CommentSection';
import LikeButton from '@/components/LikeButton';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ [추가] 로그인 상태

  // 초기 데이터 로딩 및 로그인 체크
  useEffect(() => {
    // 1. 로그인 여부 확인
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token); // 토큰이 있으면 true, 없으면 false

    // 2. 게시글 데이터 가져오기
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error('게시글 로딩 실패:', err);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // 글 삭제 핸들러
  const handleDelete = async () => {
    if (!confirm('정말 이 글을 삭제하시겠습니까? 🗑️')) return;

    try {
      await api.delete(`/posts/${id}`);
      alert('게시글이 삭제되었습니다.');
      router.push('/');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('글 삭제 권한이 없거나 실패했습니다.');
    }
  };

  if (loading) return <div className="text-center py-20">글을 불러오는 중... ⏳</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-20">글을 찾을 수 없습니다. 404 😢</div>;

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* 1. 게시글 헤더 */}
      <header className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {post.categoryName || 'General'}
          </span>
          <span>•</span>
          <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          <span>•</span>
          <span>조회수 {post.viewCount}</span>
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">by {post.writerName || '관리자'}</span>
          </div>

          {/* 👇 [수정] 로그인한 경우에만 수정/삭제 버튼 노출 */}
          {isLoggedIn && (
            <div className="flex gap-2">
              <Link 
                href={`/posts/${id}/edit`}
                className="text-sm text-slate-500 hover:text-blue-600 hover:bg-slate-50 px-3 py-1 rounded transition"
              >
                수정
              </Link>
              <button 
                onClick={handleDelete}
                className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. 게시글 본문 (HTML 렌더링) */}
      <div 
        className="prose prose-lg prose-slate max-w-none break-keep"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 좋아요 기능 (하단 중앙) */}
      <div className="flex justify-center my-10">
        <LikeButton postId={id} />
      </div>

      {/* 댓글 섹션 */}
      <CommentSection postId={id} />

      {/* 3. 하단 네비게이션 */}
      <div className="border-t border-slate-200 pt-8 mt-12 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition font-medium"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

    </article>
  );
}