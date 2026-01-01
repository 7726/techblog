import api from '@/lib/axios';
import Link from 'next/link';

// 데이터 가져오기 (서버 컴포넌트)
async function getPosts() {
  try {
    const response = await api.get('/posts');
    return response.data.content;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen pb-20">
      {/* 1. 상단 헤더 (Hero Section) */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Devlog <span className="text-blue-600">.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            개발하며 배운 것들, 삽질의 기록들을 남깁니다. 🚀
          </p>
          <div className="mt-8">
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl">
              게시글 작성하기 ✏️
            </button>
          </div>
        </div>
      </header>

      {/* 2. 게시글 목록 (Grid Layout) */}
      <main className="max-w-5xl mx-auto px-6 mt-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/posts/${post.id}`} key={post.id} className="group">
                <article className="bg-white h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                  {/* 썸네일 영역 (나중에 이미지 넣을 곳, 지금은 패턴으로 대체) */}
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                  
                  {/* 내용 영역 */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-blue-600 font-bold mb-3 uppercase tracking-wide">
                      <span>Tech</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                          {post.nickname ? post.nickname[0] : '익'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {post.nickname || '익명'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">읽기 3분</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900">아직 게시글이 없어요</h3>
            <p className="text-gray-500 mt-2">첫 번째 글의 주인공이 되어보세요!</p>
          </div>
        )}
      </main>
    </div>
  );
}