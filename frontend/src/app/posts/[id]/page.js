import api from '@/lib/axios';
import Link from 'next/link';

async function getPost(id) {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) { return null; }
}

async function getComments(id) {
  try {
    const response = await api.get(`/posts/${id}/comments`);
    return response.data.content;
  } catch (error) { return []; }
}

export default async function PostDetailPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  const comments = await getComments(id);

  if (!post) return <div className="text-center py-40 text-gray-500">글을 찾을 수 없습니다 😢</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors">
            ← 목록으로 돌아가기
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* 헤더 영역 */}
        <header className="mb-12 text-center">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
            {post.categoryName || 'Development'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-500 border-y border-gray-100 py-6">
            <span className="font-medium text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">👤</span>
              {post.nickname || '익명'}
            </span>
            <span className="text-gray-300">|</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="text-gray-300">|</span>
            <span>조회 {post.viewCount || 0}</span>
          </div>
        </header>

        {/* 본문 영역 (Typography 적용) */}
        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl">
          {post.content}
        </article>

        {/* 댓글 영역 */}
        <section className="mt-24 pt-10 border-t border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            댓글 <span className="text-blue-600 text-lg bg-blue-50 px-2 py-0.5 rounded-full">{comments.length}</span>
          </h3>
          
          <div className="space-y-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-lg shadow-inner">
                    💬
                  </div>
                  <div className="flex-1 bg-gray-50 p-5 rounded-2xl rounded-tl-none">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">{comment.authorName || '방문자'}</span>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400">아직 댓글이 없어요. 첫 댓글을 남겨주세요! 👋</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}