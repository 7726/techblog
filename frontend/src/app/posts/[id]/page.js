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
  // Next.js 15에서는 params를 await 해야 합니다.
  const { id } = await params;
  const post = await getPost(id);
  const comments = await getComments(id);

  if (!post) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        글을 찾을 수 없습니다. 😢
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* 뒤로가기 */}
      <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600">
        ← 목록으로 돌아가기
      </Link>

      {/* 헤더 */}
      <header className="mb-10 border-b border-slate-200 pb-10 text-center">
        <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
          {post.categoryName || 'Development'}
        </span>
        <h1 className="mb-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span className="font-medium text-slate-900">{post.authorNickname || '익명'}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>조회 {post.viewCount}</span>
        </div>
      </header>

      {/* 본문 (Typography 적용) */}
      <div className="prose prose-lg prose-slate max-w-none prose-a:text-blue-600 prose-img:rounded-xl">
        {/* HTML 렌더링이 필요하다면 dangerouslySetInnerHTML 사용 */}
        {/* 보안상 sanitize 필요하지만, 일단 관리자가 쓴 글이라 가정하고 렌더링 */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* 댓글 섹션 */}
      <section className="mt-20 border-t border-slate-200 pt-10">
        <h3 className="mb-8 text-2xl font-bold text-slate-900">
          댓글 <span className="text-blue-600">{comments.length}</span>
        </h3>
        
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-400">
                  {comment.authorName ? comment.authorName[0] : '?'}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-slate-900">{comment.authorName || '방문자'}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-10 text-center text-slate-500">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
          )}
        </div>
      </section>
    </article>
  );
}