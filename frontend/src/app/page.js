import Link from "next/link";

// 더미 데이터 (백엔드 연동 전 디자인 확인용)
const DUMMY_POSTS = [
  {
    id: 1,
    title: "Spring Boot 3.4 + Next.js 16 연동기",
    summary: "레거시 ASP 개발자가 최신 스택으로 넘어오면서 겪은 삽질과 해결 과정을 상세하게 기록합니다.",
    category: "Backend",
    date: "2025-12-25",
  },
  {
    id: 2,
    title: "AWS EC2에 CI/CD 파이프라인 구축하기",
    summary: "Github Actions를 활용하여 코드 푸시부터 배포까지 자동화하는 과정을 다룹니다. Docker 없이 배포하기.",
    category: "DevOps",
    date: "2025-12-20",
  },
  {
    id: 3,
    title: "Classic ASP에서 Java로 전향해야 하는 이유",
    summary: "5년차 고인물 개발자가 느낀 기술 부채와 커리어 전환에 대한 솔직한 이야기.",
    category: "Career",
    date: "2025-12-15",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      
      {/* 히어로 섹션 */}
      <section className="text-center py-10 md:py-16 space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          기록이 성장이 되는 공간,<br />
          <span className="text-blue-600">DevLog</span> 입니다.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          백엔드 개발자 윤지호의 기술 블로그입니다.<br className="hidden md:block"/>
          새로운 기술을 배우고 적용하며 겪은 경험들을 공유합니다.
        </p>
      </section>

      {/* 게시글 목록 */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">최신 글</h2>
          <Link href="/posts" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
            전체보기 &rarr;
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {DUMMY_POSTS.map((post) => (
            <article 
              key={post.id} 
              className="group flex flex-col justify-between h-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {post.category}
                  </span>
                  <time>{post.date}</time>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  <Link href={`/posts/${post.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                자세히 읽기 &rarr;
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}