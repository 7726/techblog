'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 댓글 작성 폼 상태
  const [form, setForm] = useState({
    authorName: '',
    password: '',
    content: '',
  });

  // 댓글 목록 불러오기
  const fetchComments = useCallback(async () => {
    try {
      // API 경로 확인 필요: GET /api/posts/{postId}/comments
      // 만약 백엔드가 /api/comments?postId=1 형식이면 수정 필요
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(response.data.content || response.data); // Page 객체일 경우 content, List일 경우 바로 data
    } catch (err) {
      console.error('댓글 로딩 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글 작성 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!form.content.trim()) return alert('내용을 입력해주세요.');
    if (!form.authorName.trim()) return alert('닉네임을 입력해주세요.');
    if (!form.password.trim()) return alert('비밀번호를 입력해주세요.');

    if (!confirm('댓글을 등록하시겠습니까?')) return;

    try {
      // 비회원 댓글 작성 API 호출
      // 백엔드 DTO(CommentCreateRequest) 필드명과 일치해야 함
      await api.post(`/posts/${postId}/comments`, {
        authorName: form.authorName,
        password: form.password,
        content: form.content,
      });

      alert('댓글이 등록되었습니다. 🎉');
      setForm({ authorName: '', password: '', content: '' }); // 폼 초기화
      fetchComments(); // 목록 새로고침
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert('댓글 등록에 실패했습니다. 입력값을 확인해주세요.');
    }
  };

  // 댓글 삭제 핸들러
  const handleDelete = async (commentId) => {
    const password = prompt('댓글 삭제를 위해 비밀번호를 입력해주세요.');
    if (!password) return;

    try {
      // 삭제 API 호출 (보통 DELETE /api/comments/{id} Body에 password 실어서 보냄)
      // axios delete는 body를 data 속성에 넣어야 함
      await api.delete(`/comments/${commentId}`, {
        data: { password: password } 
      });

      alert('댓글이 삭제되었습니다.');
      fetchComments();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert(err.response?.data?.message || '비밀번호가 틀렸거나 삭제에 실패했습니다.');
    }
  };

  if (loading) return <div className="py-10 text-center text-slate-500">댓글을 불러오는 중...</div>;

  return (
    <div className="mt-16 border-t border-slate-200 pt-10">
      <h3 className="text-2xl font-bold text-slate-900 mb-8">
        댓글 <span className="text-blue-600">{comments.length}</span>
      </h3>

      {/* 1. 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-6 mb-10 border border-slate-200">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="닉네임"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 (삭제용)"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <textarea
          placeholder="주제와 무관한 댓글이나 악플은 경고 없이 삭제될 수 있습니다."
          className="w-full h-24 px-4 py-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 resize-none"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <div className="mt-2 text-right">
          <button
            type="submit"
            className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition"
          >
            등록하기
          </button>
        </div>
      </form>

      {/* 2. 댓글 목록 */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            {/* 아바타 (랜덤 컬러 혹은 기본 이미지) */}
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg shrink-0">
              👤
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{comment.authorName}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                {/* 삭제 버튼 */}
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-slate-400 hover:text-red-500 underline"
                >
                  삭제
                </button>
              </div>
              
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">
            아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨주세요!
          </div>
        )}
      </div>
    </div>
  );
}