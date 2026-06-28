"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Post, PostMeta } from "@/lib/posts";
import TableOfContents from "@/components/TableOfContents";
import Subscribe from "@/components/Subscribe";
import ArticleContent from "@/components/ArticleContent";
import ReadingProgress from "@/components/ReadingProgress";
import RelatedPosts from "@/components/RelatedPosts";
import Comments from "@/components/Comments";
import PostNav from "@/components/PostNav";
import BackToTop from "@/components/BackToTop";

interface Props {
  post: Post;
  allPosts: PostMeta[];
  prev: PostMeta | null;
  next: PostMeta | null;
}

export default function PostContent({ post, allPosts, prev, next }: Props) {
  const { t, locale } = useI18n();
  const hasToc = post.headings.length > 0;
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  return (
    <>
      <ReadingProgress />
      <BackToTop />

      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-500 transition-colors mb-8"
        >
          &larr; {t("post.backHome")}
        </Link>

        <div className="lg:flex lg:gap-10">
          {/* 主内容区 */}
          <article className="min-w-0 flex-1">
            {/* 封面图 */}
            {post.cover && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            <header className="mb-10">
              <div className="flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(dateLocale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{post.readingTime} {t("post.readingTime")}</span>
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                  {post.title}
                </span>
              </h1>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="inline-block rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* 移动端折叠目录 */}
            {hasToc && (
              <details className="toc-details lg:hidden mb-8 rounded-lg border border-orange-200 dark:border-zinc-700 bg-orange-50/50 dark:bg-zinc-900/50">
                <summary className="px-4 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 cursor-pointer select-none">
                  {t("post.toc")}
                </summary>
                <div className="px-4 pb-3">
                  <TableOfContents headings={post.headings} showTitle={false} />
                </div>
              </details>
            )}

            {/* 文章内容 */}
            <ArticleContent html={post.contentHtml} />

            {/* 文章前后导航 */}
            <PostNav
              prev={prev}
              next={next}
              labels={{
                prev: t("post.prev"),
                next: t("post.next"),
              }}
            />

            {/* 相关文章推荐 */}
            {post.tags && post.tags.length > 0 && (
              <RelatedPosts
                currentSlug={post.slug}
                currentTags={post.tags}
                allPosts={allPosts}
              />
            )}

            {/* 评论区 */}
            <Comments slug={post.slug} />

            {/* 文章底部订阅 */}
            <Subscribe />
          </article>

          {/* 桌面端粘性侧边栏目录 */}
          {hasToc && (
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24">
                <TableOfContents headings={post.headings} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
