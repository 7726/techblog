'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Editor from '@/components/Editor'; // 👈 Editor 컴포넌트 import

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // HTML 내용이 들어감
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. 데이터 로딩 (카테고리 + 게시글 정보)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1) 카테고리 목록 조회
        const categoryRes = await api.get('/categories');
        setCategories(categoryRes.data);

        // 2) 수정할 게시글 정보 조회
        const postRes = await api.get(`/posts/${id}`);
        const post = postRes.data;

        // 3) 상태에 데이터 채워넣기 (Binding)
        setTitle(post.title);
        setContent(post.content); // HTML 태그가 포함된 본문
        
        // 카테고리 ID 설정 (기존 글의 카테고리가 목록에 있을 때만 설정)
        // post.categoryId가 null일 수도 있으므로 체크
        if (post.categoryId) {
            setCategoryId(post.categoryId);
        } else if (categoryRes.data.length > 0) {
            // 카테고리가 없는 글이었다면 기본값(첫 번째 카테고리) 설정
            setCategoryId(categoryRes.data[0].id);
        }

      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        alert('게시글 정보를 불러오지 못했습니다.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, router]);

  // 2. 수정 완료 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 혹시 모를 폼 전송 방지

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      // PUT 요청으로 수정
      await api.put(`/posts/${id}`, {
        title,
        content,
        categoryId: categoryId ? Number(categoryId) : null,
      });

      alert('수정되었습니다! ✨');
      router.push(`/posts/${id}`); // 상세 페이지로 이동
    } catch (err) {
      console.error(err);
      // 백엔드 에러 메시지 보여주기
      const message = err.response?.data?.message || '수정에 실패했습니다.';
      alert(`오류 발생: ${message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-20">데이터를 불러오는 중... ⏳</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <button 
          onClick={() => router.back()}
          className="text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← 취소
        </button>
        
        <div className="flex gap-4">
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            수정 완료
          </button>
        </div>
      </header>

      {/* 메인 입력 영역 */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
        {/* 카테고리 선택 */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-40 p-2 text-sm text-slate-600 bg-slate-50 rounded-md border-none focus:ring-0 cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* 제목 입력 */}
        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="w-full text-4xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 focus:outline-none bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="w-16 h-1 bg-slate-900 rounded-full" />

        {/* 👇 [수정] 본문 에디터 (기존 textarea 대체) */}
        <div className="h-[calc(100vh-350px)]"> 
          <Editor 
            value={content} 
            onChange={setContent} 
          />
        </div>
      </div>
    </div>
  );
}