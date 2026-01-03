'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function WritePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // 입력 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // 권한 체크 로딩 상태

  // 1. 초기화 (권한 체크 및 카테고리 로딩)
  useEffect(() => {
    // A. 비로그인 접근 차단 로직
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다. 🙅‍♂️');
      router.replace('/login'); // 뒤로가기 방지를 위해 replace 사용
      return;
    }
    setIsAuthChecking(false); // 토큰 있으면 화면 보여줌

    // B. 카테고리 목록 가져오기
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
  }, [router]);

  // 2. 글 저장 핸들러
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (!confirm('글을 발행하시겠습니까?')) return;

    setLoading(true);
    try {
      const payload = {
        title,
        content,
        categoryId: categoryId ? Number(categoryId) : null, 
      };

      await api.post('/posts', payload);
      
      alert('글이 성공적으로 저장되었습니다! 🎉');
      router.push('/'); 
    } catch (err) {
      console.error('글 작성 실패:', err);
      alert(err.response?.data?.message || '글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 3. 이미지 업로드 핸들러
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post('/files/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = response.data.url || response.data; 
      const imageMarkdown = `\n![이미지 설명](${imageUrl})\n`;
      setContent((prev) => prev + imageMarkdown);
      
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 권한 체크 중이면 빈 화면(혹은 로딩바) 노출
  if (isAuthChecking) {
    return <div className="flex h-screen items-center justify-center">로그인 확인 중...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">새 글 작성 🖊️</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            취소
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? '저장 중...' : '작성 완료'}
          </button>
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        
        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
          <select 
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 입력 */}
        <div>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full text-3xl font-bold placeholder-slate-300 border-b border-transparent focus:border-slate-300 focus:outline-none py-2 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 툴바 */}
        <div className="flex items-center gap-2 border-y border-slate-100 py-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition"
          >
            <span>📷 이미지 업로드</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
          <span className="text-xs text-slate-400 ml-auto">마크다운 문법이 지원됩니다.</span>
        </div>

        {/* 본문 입력 */}
        <textarea
          placeholder="당신의 이야기를 들려주세요..."
          className="w-full min-h-[500px] resize-none text-lg text-slate-800 placeholder-slate-300 focus:outline-none leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}