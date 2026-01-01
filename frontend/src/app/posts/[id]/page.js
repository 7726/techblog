import api from '@/lib/axios';
import Link from 'next/link';

// 1. 게시글 상세 조회 (서버 요청)
async function getPost(id) {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    return null;
  }
}

// 2. 댓글 목록 조회 (서버 요청)
async function getComments(id) {
  try {
    const response = await api.get(`/posts/${id}/comments`);
    return response.data.content; // Page 객체의 content 배열 반환
  } catch (error) {
    console.error('댓글 조회 실패:', error);
    return [];
  }
}

// 3. 상세 페이지 컴포넌트
export default async function PostDetailPage({ params }) {
  const { id } = await params; // URL에서 id(게시글 번호) 가져오기

  console.log("확인된 ID:", id);

  // 병렬로 데이터 요청 (속도 UP 🚀)
  const postData = getPost(id);
  const commentsData = getComments(id);

  // 두 요청이 다 끝날 때까지 기다림
  const [post, comments] = await Promise.all([postData, commentsData]);

  // 게시글이 없으면 404 처리 (간단하게)
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center py-20">
        <h1 className="text-2xl font-bold text-gray-700">게시글을 찾을 수 없습니다. 😭</h1>
        <Link href="/" className="text-blue-500 hover:underline mt-4 block">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 🔙 뒤로가기 버튼 */}
      <Link href="/" className="text-gray-500 hover:text-black mb-6 inline-block">
        ← 목록으로 돌아가기
      </Link>

      {/* 📝 게시글 본문 영역 */}
      <article className="prose lg:prose-xl mb-12">
        <header className="border-b pb-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>작성자: {post.nickname || '익명'}</span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </header>
        
        {/* 줄바꿈 처리를 위해 whitespace-pre-wrap 적용 */}
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg min-h-[200px]">
          {post.content}
        </div>
      </article>

      {/* 💬 댓글 영역 */}
      <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          댓글 <span className="text-blue-600">{comments.length}</span>
        </h3>

        {/* 댓글 목록 */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">
                    {comment.authorName || '익명'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
          )}
        </div>
      </section>
    </div>
  );
}