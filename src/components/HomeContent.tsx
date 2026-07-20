"use client";

/**
 * 首页内容（客户端组件）
 *
 * 布局：左侧 Sidebar + 右侧文章列表。
 * 文章分页（POSTS_PER_PAGE=5）通过 URL ?page=N 控制。
 * 移动端将 Sidebar 中的热门文章和标签云单独展示在主内容区底部。
 */
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
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            {t("home.greeting")}
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
            {t("home.tagline")}
          </p>
        </section>

        {/* 文章列表 */}
        <section>
          <h2 className="mb-6 inline-block border-b-2 border-zinc-300 pb-1 text-sm font-semibold uppercase tracking-widest text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            {t("home.latestPosts")}
          </h2>
          {pagePosts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400" role="status">
              {t("home.empty")}
            </p>
          ) : (
          <div className="home-post-list">
            {pagePosts.map((post) => (
              <article key={post.slug} className="home-post">
                <div className="home-post__body">
                  <div className="flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(dateLocale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>
                      {post.readingTime} {t("post.readingTime")}
                    </span>
                  </div>
                  <h3 className="home-post__title">
                    {post.pinned && (
                      <span className="mr-2 inline-block rounded-sm bg-zinc-100 px-2 py-0.5 align-middle text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        <span aria-hidden="true">📌 </span>
                        {t("post.pinned")}
                      </span>
                    )}
                    <Link href={`/posts/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="home-post__summary">
                    {post.summary}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="home-post__tags">
                      {post.tags.map((tag) => (
                        <TagLink
                          key={tag}
                          tag={tag}
                          className="tag-link"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          )}

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
        <section className="mobile-discover lg:hidden mt-12">
          <h2 className="mb-4 inline-block border-b-2 border-zinc-300 pb-1 text-sm font-semibold uppercase tracking-widest text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
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
        <section className="mobile-discover lg:hidden mt-10">
          <h2 className="mb-4 inline-block border-b-2 border-zinc-300 pb-1 text-sm font-semibold uppercase tracking-widest text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
            {t("nav.tags")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 rounded-sm bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                {tag}
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
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
