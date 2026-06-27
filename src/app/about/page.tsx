import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-500 transition-colors mb-8"
      >
        &larr; 返回首页
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          关于
        </span>
      </h1>
      <div className="prose max-w-none mt-8">
        <p>你好，我是 LunaPath。</p>
        <p>
          这里是我记录技术学习、生活思考和阅读笔记的地方。写作帮助我整理思路，也希望能为你带来一些价值。
        </p>
        <h2>联系方式</h2>
        <p>
          可以通过 GitHub 找到我，或者在文章下方留言讨论。
        </p>
      </div>
    </div>
  );
}
