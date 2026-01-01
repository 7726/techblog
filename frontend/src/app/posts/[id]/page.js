import api from '@/lib/axios';
import Link from 'next/link';

// 1. 데이터 조회 함수들
async function getPost(id) {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

async function getComments(id) {
  try {
    const response = await api.get(`/posts/${id}/comments`);
    return response.data.content;
  } catch (error) {
    return [];
  }
}

// 2. 상세 페이지 컴포넌트
export default async function PostDetailPage({ params }) {
  const { id } = await params; // Next.js 15 대응
  
  const postData = getPost(id);
  const commentsData = getComments(id);
  const [post, comments] = await Promise.all([postData, commentsData]);

  if (!post) return <div className="text-center py-20">글을 찾을 수 없습니다 😢</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors">
            ← 목록으로
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* 📝 게시글 헤더 */}
        <header className="mb-10 text-center">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-bold rounded-full mb-4">
            {post.categoryName || 'General'}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-500 border-t border-b border-gray-100 py-4 mt-8">
            <span className="font-medium text-gray-900">{post.nickname || '익명'}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>조회 {post.viewCount || 0}</span>
          </div>
        </header>

        {/* 📖 게시글 본문 (Typography 플러그인 적용) */}
        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600">
          {post.content}
        </article>

        {/* 💬 댓글 섹션 */}
        <section className="mt-20 pt-10 border-t border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            댓글 <span className="text-blue-600">{comments.length}</span>
          </h3>

          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm border border-gray-100">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900">{comment.authorName || '방문자'}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">첫 댓글을 남겨주세요! 👋</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}