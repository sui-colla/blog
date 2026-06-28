import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import Subscribe from "@/components/Subscribe";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      {/* 顶部 Banner */}
      <section className="mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
            你好，欢迎来访。
          </span>
        </h1>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
          这里记录一些关于技术、思考和生活的内容。写作帮助我理清思路，也希望对你有所启发。
        </p>
      </section>

      {/* 文章列表 */}
      <section>
        <h2 className="mb-8 inline-block text-sm font-semibold uppercase tracking-widest text-orange-500 border-b-2 border-orange-300 pb-1">
          最新文章
        </h2>
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="group block rounded-xl p-5 -mx-5 hover:bg-orange-50/60 dark:hover:bg-zinc-900 transition-colors"
              >
                <time
                  dateTime={post.date}
                  className="text-sm text-zinc-400 dark:text-zinc-500"
                >
                  {new Date(post.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h3 className="mt-1 text-xl font-semibold text-zinc-800 group-hover:text-orange-600 dark:text-zinc-50 dark:group-hover:text-orange-400 transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {post.summary}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 订阅组件 */}
      <Subscribe />
    </div>
  );
}
