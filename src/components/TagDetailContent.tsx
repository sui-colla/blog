"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/posts";

interface Props {
  tag: string;
  posts: PostMeta[];
}

export default function TagDetailContent({ tag, posts }: Props) {
  const { t, locale } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/tags"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-500 transition-colors mb-8"
      >
        &larr; {t("tags.allTags")}
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          {tag}
        </span>
      </h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        {t("tags.articleCount").replace("{count}", String(posts.length))}
      </p>

      <div className="mt-10 flex flex-col gap-8">
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
                {new Date(post.date).toLocaleDateString(dateLocale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-1 text-xl font-semibold text-zinc-800 group-hover:text-orange-600 dark:text-zinc-50 dark:group-hover:text-orange-400 transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {post.summary}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                        t === tag
                          ? "bg-orange-500 text-white"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
