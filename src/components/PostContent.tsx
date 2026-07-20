"use client";

/**
 * 文章详情页布局（客户端组件）
 *
 * 页面结构：
 * - 顶部：阅读进度条 + 回到顶部按钮
 * - 主体（lg:flex）：左侧文章区 + 右侧粘性目录（桌面端）
 * - 文章区：元信息 → 系列导航 → 移动端折叠目录 → 正文 → 分享 → 上下篇 → 相关推荐 → 评论 → 赞赏 → 订阅
 *
 * 移动端目录折叠为 <details>，桌面端目录 sticky 固定在右侧。
 */
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
import Donate from "@/components/Donate";
import ShareButtons from "@/components/ShareButtons";
import PostSeries from "@/components/PostSeries";
import { absoluteUrl } from "@/config/site";

interface Props {
  post: Post;
  allPosts: PostMeta[];
  prev: PostMeta | null;
  next: PostMeta | null;
  seriesPosts?: PostMeta[];
}

export default function PostContent({ post, allPosts, prev, next, seriesPosts }: Props) {
  const { t, locale } = useI18n();
  const hasToc = post.headings.length > 0;
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";
  const postUrl = absoluteUrl(`/posts/${post.slug}`);

  return (
    <>
      <ReadingProgress />
      <BackToTop />

      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-teal-700 transition-colors mb-8"
        >
          &larr; {t("post.backHome")}
        </Link>

        <div className="lg:flex lg:gap-10">
          {/* 主内容区 */}
          <article className="min-w-0 flex-1">
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
                <span>·</span>
                <span>{post.wordCount.toLocaleString()} {t("post.wordCount")}</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
                {post.title}
              </h1>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="tag-link"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* 系列文章导航 */}
            {post.series && seriesPosts && seriesPosts.length > 1 && (
              <PostSeries
                seriesName={post.series}
                posts={seriesPosts}
                currentSlug={post.slug}
              />
            )}

            {/* 移动端折叠目录 */}
            {hasToc && (
              <details className="toc-details lg:hidden mb-8 rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <summary className="px-4 py-2.5 text-sm font-medium text-teal-800 dark:text-teal-300 cursor-pointer select-none">
                  {t("post.toc")}
                </summary>
                <div className="px-4 pb-3">
                  <TableOfContents headings={post.headings} showTitle={false} />
                </div>
              </details>
            )}

            {/* 文章内容 */}
            <ArticleContent html={post.contentHtml} />

            {/* 分享 + 复制链接 */}
            <ShareButtons title={post.title} url={postUrl} />

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
            <Comments />

            {/* 赞赏支持 */}
            <Donate />

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
