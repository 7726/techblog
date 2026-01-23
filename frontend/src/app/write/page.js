'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Editor from '@/components/Editor'; // 👈 Editor 컴포넌트 import

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Editor는 HTML 태그 포함된 문자열 반환
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');

  // 1. 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error('카테고리 로딩 실패:', err);
      }
    };
    fetchCategories();
  }, []);

  // 2. 작성 완료 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    // Editor의 경우 태그만 있고 내용은 비어있을 수 있으므로 (예: <p><br></p>) 체크 필요
    // 여기서는 간단하게 태그 제외하고 텍스트만 있는지 체크하거나, 그냥 trim 정도만 체크
    if (!content.trim()) { 
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      await api.post('/posts', {
        title,
        content,
        categoryId: categoryId ? Number(categoryId) : null,
      });
      alert('작성되었습니다!');
      router.push('/'); 
    } catch (err) {
      console.error(err);
      alert('작성 실패: ' + (err.response?.data?.message || '오류 발생'));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 상단 헤더 (저장 버튼 포함) */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <button 
          onClick={() => router.back()}
          className="text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← 나가기
        </button>
        
        <div className="flex gap-4">
          <button 
            type="button" // form submit 방지
            className="text-slate-400 hover:text-slate-600 transition-colors font-medium"
          >
            임시저장
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-slate-900 text-white px-4 py-2 rounded-md font-medium hover:bg-slate-800 transition-colors"
          >
            출간하기
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
          {/* Editor 컴포넌트에게 높이를 100%로 줘서 부모 div를 채우게 함 */}
          <Editor 
            value={content} 
            onChange={setContent} 
          />
        </div>
      </div>
    </div>
  );
}