import api from '@/lib/axios';
import Link from 'next/link';

// 1. 게시글 데이터 가져오는 함수 (서버에서 실행됨)
async function getPosts() {
  try {
    console.log('요청 주소 확인:', api.defaults.baseURL);
    // baseURL에 /api가 있으니 '/posts'만 요청하면 됨
    const response = await api.get('/posts'); 
    
    // Spring Boot의 Page 객체는 실제 데이터가 'content' 필드 안에 들어있음!
    return response.data.content; 
  } catch (error) {
    console.error('게시글 로딩 실패:', error);
    return []; // 에러 나면 빈 배열 반환
  }
}

// 2. 메인 페이지 컴포넌트 (async 필수!)
export default async function Home() {
  const posts = await getPosts(); // 데이터 가져오기

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10 flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">🔥 Jyo's Tech Blog</h1>
        {/* 아직 로그인/글쓰기 버튼은 기능 없으니 모양만 */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          글쓰기
        </button>
      </header>

      <main className="grid gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100">
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-xl font-bold mb-2 text-gray-900">{post.title}</h2>
                <p className="text-gray-600 line-clamp-2">{post.content}</p> {/* 본문 미리보기 (2줄 제한) */}
                <div className="mt-4 text-sm text-gray-400 flex justify-between">
                   <span>작성자: {post.nickname || '익명'}</span>
                   <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>아직 작성된 게시글이 없습니다. 텅~ 🗑️</p>
          </div>
        )}
      </main>
    </div>
  );
}