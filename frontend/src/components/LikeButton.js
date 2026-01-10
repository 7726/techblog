'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function LikeButton({ postId }) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 초기 좋아요 상태 불러오기
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        // GET 요청 시 백엔드가 IP 혹은 토큰으로 'liked' 여부를 판단해서 줌
        const response = await api.get(`/posts/${postId}/likes`);
        setLiked(response.data.likedByMe); 
        setLikeCount(response.data.likeCount);
      } catch (err) {
        console.error('좋아요 정보 로딩 실패:', err);
      }
    };

    if (postId) {
      fetchLikeStatus();
    }
  }, [postId]);

  // 좋아요 토글 핸들러
  const handleToggleLike = async () => {
    const token = localStorage.getItem('accessToken');

    // [정책 1] 비회원은 '취소(Unlike)' 불가
    // 이미 좋아요(liked) 상태인데 토큰이 없다면 => 비회원임
    if (liked && !token) {
      alert('비회원은 좋아요 취소가 불가능합니다. 😅');
      return;
    }

    if (loading) return; 

    // [정책 2] 낙관적 업데이트 (UI 먼저 반영)
    // 비회원이거나 안 누른 상태면 => +1, 빨간 하트
    // 회원이면서 누른 상태면 => -1, 하얀 하트
    const previousLiked = liked;
    const previousCount = likeCount;
    
    // UI 예측 변경
    const nextLiked = !liked;
    const nextCount = nextLiked ? likeCount + 1 : likeCount - 1;

    setLiked(nextLiked);
    setLikeCount(nextCount);
    setLoading(true);

    try {
      // API 호출 (토큰 없어도 그냥 보냄 -> 백엔드가 IP로 처리)
      const response = await api.post(`/posts/${postId}/likes`);
      
      // [중요] 서버 응답값으로 UI 강제 동기화 (DB 정합성 보장)
      // 만약 중복 좋아요였다면 서버가 원래 개수를 그대로 줄 것임
      if (response.data) {
        setLiked(response.data.likedByMe);
        setLikeCount(response.data.likeCount);
      }

    } catch (err) {
      console.error('좋아요 요청 실패:', err);
      // 에러 시 롤백
      setLiked(previousLiked);
      setLikeCount(previousCount);
      
      // 백엔드에서 명시적으로 에러 메시지를 보낸 경우 (예: "이미 좋아요를 눌렀습니다")
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
        liked
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      <span className={`text-xl transition-transform ${liked ? 'scale-110' : ''}`}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span className="font-medium text-sm">
        {likeCount}
      </span>
    </button>
  );
}