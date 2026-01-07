'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/axios';

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams(); // URL에서 글 ID 가져오기
  const fileInputRef = useRef(null);

  // 입력 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // 데이터 로딩 상태

  // 1. 초기 데이터 로딩 (카테고리 + 기존 글 내용)
  useEffect(() => {
    // 비로그인 접근 차단
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      router.replace('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // 카테고리 목록과 게시글 상세 내용을 병렬로 가져옴 (속도 향상)
        const [catRes, postRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/posts/${id}`)
        ]);

        setCategories(catRes.data);
        
        // 기존 글 내용 채우기
        const post = postRes.data;
        setTitle(post.title);
        setContent(post.content);
        // 백엔드 응답에 categoryId가 있다고 가정 (없으면 categoryName으로 찾거나 DTO 수정 필요)
        if (post.categoryId) {
            setCategoryId(post.categoryId);
        } else if (catRes.data.length > 0) {
            // 카테고리 ID가 응답에 없으면 기본값 (혹은 매칭 로직 필요)
            setCategoryId(catRes.data[0].id);
        }

      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        alert('글 정보를 불러오지 못했습니다.');
        router.back();
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  // 2. 글 수정 요청 (PUT)
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (!confirm('글을 수정하시겠습니까?')) return;

    setLoading(true);
    try {
      // PostUpdateRequest DTO에 맞춤
      const payload = {
        title,
        content,
        categoryId: categoryId ? Number(categoryId) : null, 
      };

      await api.put(`/posts/${id}`, payload);
      
      alert('글이 성공적으로 수정되었습니다! 🎉');
      router.push(`/posts/${id}`); // 상세 페이지로 이동
    } catch (err) {
      console.error('글 수정 실패:', err);
      alert(err.response?.data?.message || '글 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 3. 이미지 업로드 (글쓰기와 동일)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post('/images', formData, {
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

  if (initialLoading) {
    return <div className="flex h-screen items-center justify-center">데이터 불러오는 중... ⏳</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">글 수정하기 ✏️</h1>
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
            {loading ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </div>

      {/* 입력 폼 (글쓰기 페이지와 동일한 UI) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
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

        <div>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full text-3xl font-bold placeholder-slate-300 border-b border-transparent focus:border-slate-300 focus:outline-none py-2 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

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

        <textarea
          placeholder="내용을 입력하세요..."
          className="w-full min-h-[500px] resize-none text-lg text-slate-800 placeholder-slate-300 focus:outline-none leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}