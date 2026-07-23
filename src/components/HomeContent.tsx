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
const DISCOVER_TAG_LIMIT = 6;
const DISCOVER_POPULAR_LIMIT = 4;

export default function HomeContent({ posts, tags, popularPosts, page = 1 }: Props) {
  const { t, locale } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE);
  const starterPosts = Array.from(
    new Map(
      [...posts.filter((post) => post.pinned), ...popularPosts, ...posts].map((post) => [
        post.slug,
        post,
      ])
    ).values()
  ).slice(0, 3);
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
          {starterPosts.length > 0 && (
            <div className="home-start-here" aria-labelledby="start-here-title">
              <h2 id="start-here-title" className="home-section-label">
                {t("home.startHere")}
              </h2>
              <div className="home-start-here__list">
                {starterPosts.map((post) => (
                  <Link key={post.slug} href={`/posts/${post.slug}`} className="home-start-here__link">
                    <span>{post.title}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 文章列表 */}
        <section>
          <h2 className="home-section-label mb-5">
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
                  <Link href={`/posts/${post.slug}`} className="home-post__read-more">
                    {t("home.readPost")} <span aria-hidden="true">&rarr;</span>
                  </Link>
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

        <section className="home-discover-section">
          <div className="home-discover-section__heading">
            <h2 className="home-section-label">
              {t("nav.tags")}
            </h2>
            <Link href="/tags" className="home-discover-section__link">
              {t("browse.allTags")} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="home-topic-list">
            {tags.slice(0, DISCOVER_TAG_LIMIT).map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="home-topic-link"
              >
                {tag}
                <span>{count}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-discover-section">
          <div className="home-discover-section__heading">
            <h2 className="home-section-label">
            {t("popular.title")}
            </h2>
            <Link href="/archive" className="home-discover-section__link">
              {t("browse.archive")} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          {popularPosts.length > 0 ? (
            <div className="mobile-popular-list">
              {popularPosts.slice(0, DISCOVER_POPULAR_LIMIT).map((post, index) => (
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

        {/* 订阅组件 */}
        <Subscribe />
      </div>
    </div>
  );
}
