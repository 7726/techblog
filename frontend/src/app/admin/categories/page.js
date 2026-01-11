'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function CategoryManagePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 수정 모드 상태 (어떤 카테고리를 수정 중인지)
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // 1. 초기 로딩 및 권한 체크
  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('관리자 로그인이 필요합니다.');
        router.replace('/login');
        return;
      }
      
      await fetchCategories();
    };
    
    checkAdminAndFetch();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('카테고리 로딩 실패:', err);
      // 권한 없음 에러(403) 처리 등은 axios interceptor 혹은 여기서 추가 가능
    } finally {
      setLoading(false);
    }
  };

  // 2. 카테고리 추가
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      // CreateRequest DTO 구조 확인 필요 (보통 { name: "..." })
      await api.post('/categories', { name: newCategoryName });
      setNewCategoryName('');
      fetchCategories(); // 목록 갱신
      alert('카테고리가 추가되었습니다.');
    } catch (err) {
      console.error(err);
      alert('카테고리 추가 실패: ' + (err.response?.data?.message || '오류 발생'));
    }
  };

  // 3. 카테고리 삭제
  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까? (삭제 시 해당 카테고리 글들의 분류가 해제될 수 있습니다.)')) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      alert('삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제 실패: ' + (err.response?.data?.message || '권한이 없거나 오류가 발생했습니다.'));
    }
  };

  // 4. 수정 모드 진입
  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  // 5. 수정 저장
  const handleUpdate = async () => {
    if (!editingName.trim()) return;

    try {
      await api.put(`/categories/${editingId}`, { name: editingName });
      setEditingId(null);
      setEditingName('');
      fetchCategories();
      alert('수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('수정 실패: ' + (err.response?.data?.message || '오류 발생'));
    }
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">카테고리 관리 🗂️</h1>
        <button 
          onClick={() => router.push('/')}
          className="text-sm text-slate-500 hover:text-slate-900 transition"
        >
          ← 메인으로 돌아가기
        </button>
      </div>

      {/* 카테고리 추가 폼 */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input 
          type="text"
          placeholder="새 카테고리 이름 입력"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 transition text-sm"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition text-sm"
        >
          추가
        </button>
      </form>

      {/* 카테고리 목록 */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition">
            
            {editingId === cat.id ? (
              // 수정 모드 UI
              <div className="flex flex-1 gap-2 items-center">
                <input 
                  type="text"
                  className="flex-1 px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-1">
                  <button 
                    onClick={handleUpdate} 
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                  >
                    저장
                  </button>
                  <button 
                    onClick={() => setEditingId(null)} 
                    className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium hover:bg-slate-200"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              // 일반 보기 UI
              <>
                <span className="font-medium text-slate-800">{cat.name}</span>
                <div className="flex gap-2 text-sm">
                  <button 
                    onClick={() => startEdit(cat)}
                    className="text-slate-500 hover:text-blue-600 px-2 py-1 transition"
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="text-slate-500 hover:text-red-600 px-2 py-1 transition"
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            등록된 카테고리가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}