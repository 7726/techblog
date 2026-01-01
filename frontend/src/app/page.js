import api from '@/lib/axios';
import Link from 'next/link';

async function getPosts() {
  try {
    const response = await api.get('/posts');
    return response.data.content;
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section: 블로그 타이틀 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            DevLog <span className="text-blue-600">.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            개발의 모든 순간을 기록합니다. 🚀
          </p>
          <div className="mt-10">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              게시글 작성하기 ✏️
            </button>
          </div>
        </div>
      </header>

      {/* 게시글 목록 (카드 디자인) */}
      <main className="max-w-5xl mx-auto px-6 mt-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/posts/${post.id}`} key={post.id} className="group">
                <article className="bg-white h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                  {/* 카드 상단 장식 (이미지 대신 그래픽) */}
                  <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border-b border-gray-50 group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
                    <span className="text-5xl drop-shadow-sm">📝</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-blue-600 font-bold mb-3 uppercase tracking-wider">
                      <span>Tech</span>
                      <span className="text-gray-300">•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                        {post.nickname ? post.nickname[0] : '익'}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {post.nickname || '익명'}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900">아직 게시글이 없어요</h3>
            <p className="text-gray-500 mt-2">첫 번째 글의 주인공이 되어보세요!</p>
          </div>
        )}
      </main>
    </div>
  );
}