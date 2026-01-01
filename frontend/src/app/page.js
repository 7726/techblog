import api from '@/lib/axios';
import Link from 'next/link';

// 데이터 페칭 로직 유지
async function getPosts() {
  try {
    const response = await api.get('/posts');
    return response.data.content;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* 히어로 섹션 (제목) */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          기록하고, <span className="text-blue-600">성장합니다.</span>
        </h1>
        <p className="text-lg text-slate-600">
          Classic ASP에서 Modern Java Backend로 나아가는 여정
        </p>
      </div>

      {/* 게시글 목록 (Grid Layout) */}
      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="group block h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                
                {/* 썸네일 대체용 색상 박스 (이미지가 있다면 img 태그로 교체 가능) */}
                <div className="h-40 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl">
                  ☕️
                </div>

                <div className="flex flex-1 flex-col p-6">
                  {/* 카테고리 & 날짜 */}
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                    <span>{post.categoryName || 'Uncategorized'}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h2 className="mb-3 text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600">
                    {post.title}
                  </h2>

                  {/* 본문 요약 (HTML 태그 제거는 CSS line-clamp로 처리하거나 서버에서 plain text로 받는게 좋음) */}
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {post.content.replace(/<[^>]*>?/gm, '')} {/* 임시로 태그 제거 */}
                  </p>

                  {/* 작성자 정보 */}
                  <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                      {post.authorNickname ? post.authorNickname[0] : 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {post.authorNickname || '익명'}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <div className="text-6xl">📭</div>
          <h3 className="mt-4 text-xl font-bold text-slate-900">게시글이 없습니다.</h3>
          <p className="mt-2 text-slate-500">첫 번째 글을 작성해보세요!</p>
        </div>
      )}
    </div>
  );
}