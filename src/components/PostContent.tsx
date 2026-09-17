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

      <div className="article-layout">
        <Link href="/" className="page-back">
          &larr; {t("post.backHome")}
        </Link>

        <div className="article-grid">
          {/* 主内容区 */}
          <article className="article-main">
            <header className="article-header">
              <div className="article-meta">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(dateLocale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} {t("post.readingTime")}</span>
                <span aria-hidden="true">·</span>
                <span>{post.wordCount.toLocaleString()} {t("post.wordCount")}</span>
              </div>
              <h1 className="article-title">
                {post.title}
              </h1>
              {post.tags && post.tags.length > 0 && (
                <div className="article-tags">
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
              <details className="toc-details article-toc-mobile">
                <summary>
                  {t("post.toc")}
                </summary>
                <div>
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
            <aside className="article-aside">
              <div className="article-aside__inner">
                <TableOfContents headings={post.headings} levels={[2]} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
