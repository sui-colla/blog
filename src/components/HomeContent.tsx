"use client";

import Link from "next/link";
import Subscribe from "@/components/Subscribe";
import TagLink from "@/components/TagLink";
import Sidebar from "@/components/Sidebar";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/posts";

interface Tag {
  tag: string;
  count: number;
}

interface Props {
  posts: PostMeta[];
  tags: Tag[];
  popularPosts: PostMeta[];
  page?: number;
}

const POSTS_PER_PAGE = 5;

export default function HomeContent({ posts, tags, popularPosts, page = 1 }: Props) {
  const { t, locale } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="home-layout">
      {/* 左侧边栏 */}
      <Sidebar tags={tags} postCount={posts.length} popularPosts={popularPosts} />

      {/* 右侧主内容 */}
      <div className="home-main">
        {/* 顶部 Banner */}
        <section className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
              {t("home.greeting")}
            </span>
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
            {t("home.tagline")}
          </p>
        </section>

        {/* 文章列表 */}
        <section>
          <h2 className="mb-6 inline-block text-sm font-semibold uppercase tracking-widest text-orange-500 border-b-2 border-orange-300 pb-1">
            {t("home.latestPosts")}
          </h2>
          <div className="flex flex-col gap-8">
            {pagePosts.map((post) => (
              <article key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group block rounded-xl overflow-hidden hover:bg-orange-50/60 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString(dateLocale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span>·</span>
                      <span>
                        {post.readingTime} {t("post.readingTime")}
                      </span>
                    </div>
                    <h3 className="mt-1 text-xl font-semibold text-zinc-800 group-hover:text-orange-600 dark:text-zinc-50 dark:group-hover:text-orange-400 transition-colors">
                      {post.pinned && (
                        <span className="inline-block mr-2 text-xs font-medium text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full align-middle">
                          📌 {locale === "zh" ? "置顶" : "Pinned"}
                        </span>
                      )}
                      {post.title}
                    </h3>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {post.summary}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {post.tags.map((tag) => (
                          <TagLink
                            key={tag}
                            tag={tag}
                            className="inline-block rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* 分页导航 */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-10" aria-label={t("pagination.aria")}>
              {hasPrev ? (
                <Link
                  href={`/?page=${currentPage - 1}`}
                  className="pagination-btn"
                >
                  ← {t("pagination.prev")}
                </Link>
              ) : (
                <span className="pagination-btn pagination-btn--disabled">
                  ← {t("pagination.prev")}
                </span>
              )}
              <span className="pagination-info">
                {currentPage} / {totalPages}
              </span>
              {hasNext ? (
                <Link
                  href={`/?page=${currentPage + 1}`}
                  className="pagination-btn"
                >
                  {t("pagination.next")} →
                </Link>
              ) : (
                <span className="pagination-btn pagination-btn--disabled">
                  {t("pagination.next")} →
                </span>
              )}
            </nav>
          )}
        </section>

        {/* 移动端热门文章（桌面端由 Sidebar 显示） */}
        <section className="lg:hidden mt-12">
          <h2 className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-orange-500 border-b-2 border-orange-300 pb-1">
            {t("popular.title")}
          </h2>
          {popularPosts.length > 0 ? (
            <div className="mobile-popular-list">
              {popularPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="mobile-popular-link"
                >
                  <span className="mobile-popular-rank">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mobile-popular-content">
                    <span className="mobile-popular-title">{post.title}</span>
                    <span className="mobile-popular-meta">
                      {post.readingTime} {t("post.readingTime")}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("popular.empty")}
            </p>
          )}
        </section>

        {/* 移动端标签云（桌面端由 Sidebar 显示） */}
        <section className="lg:hidden mt-12">
          <h2 className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-orange-500 border-b-2 border-orange-300 pb-1">
            {t("nav.tags")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40 transition-colors"
              >
                {tag}
                <span className="text-xs text-orange-400 dark:text-orange-500">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 订阅组件 */}
        <Subscribe />
      </div>
    </div>
  );
}
