"use client";

/**
 * 文章详情页（对应 Fuwari posts/[slug].astro）
 *
 * 卡片内依次是：字数/阅读时间 → 大标题 → 日期/分类/标签 → 正文；
 * 卡片外是上一篇/下一篇、相关文章、评论、赞赏与订阅卡片。
 */
import { Calendar, Clock, FileText, Folder, Tag } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import ArticleContent from "@/components/post/ArticleContent";
import ReadingProgress from "@/components/post/ReadingProgress";
import RelatedPosts from "@/components/post/RelatedPosts";
import Comments from "@/components/post/Comments";
import PostNav from "@/components/post/PostNav";
import BackToTop from "@/components/ui/BackToTop";
import Donate from "@/components/post/Donate";
import ShareButtons from "@/components/post/ShareButtons";
import PostSeries from "@/components/post/PostSeries";
import Subscribe from "@/components/ui/Subscribe";
import { useI18n } from "@/lib/i18n";
import { absoluteUrl } from "@/config/site";
import type { Post, PostMeta } from "@/lib/content/posts";

interface Props {
  post: Post;
  allPosts: PostMeta[];
  prev: PostMeta | null;
  next: PostMeta | null;
  seriesPosts?: PostMeta[];
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

export default function PostContent({
  post,
  allPosts,
  prev,
  next,
  seriesPosts,
  tags = [],
  popularPosts = [],
}: Props) {
  const { t } = useI18n();
  const [category, ...restTags] = post.tags ?? [];
  const postUrl = absoluteUrl(`/posts/${post.slug}`);

  return (
    <>
      <ReadingProgress />
      <BackToTop />

      <PageShell tags={tags} popularPosts={popularPosts} headings={post.headings}>
        <article className="post-shell">
          <div className="post-page">
            <div className="post-stats">
              <div className="post-stats__item">
                <span className="post-stats__icon" aria-hidden="true">
                  <FileText size={13} />
                </span>
                <span className="post-stats__text">
                  {post.wordCount.toLocaleString()} {t("post.wordCount")}
                </span>
              </div>
              <div className="post-stats__item">
                <span className="post-stats__icon" aria-hidden="true">
                  <Clock size={13} />
                </span>
                <span className="post-stats__text">
                  {post.readingTime} {t("post.readingTime")}
                </span>
              </div>
            </div>

            <h1 className="post-title">{post.title}</h1>

            <div className="post-card__meta">
              <div className="meta-item">
                <span className="meta-icon" aria-hidden="true">
                  <Calendar size={15} />
                </span>
                <time className="meta-text" dateTime={post.date}>
                  {post.date}
                </time>
              </div>

              <div className="meta-item">
                <span className="meta-icon" aria-hidden="true">
                  <Folder size={15} />
                </span>
                {category ? (
                  <a
                    href={`/tags/${encodeURIComponent(category)}`}
                    className="meta-text"
                  >
                    {category}
                  </a>
                ) : (
                  <span className="meta-text">{t("post.uncategorized")}</span>
                )}
              </div>

              {(restTags.length > 0 || (post.tags?.length ?? 0) > 0) && (
                <div className="meta-item">
                  <span className="meta-icon" aria-hidden="true">
                    <Tag size={15} />
                  </span>
                  <span className="meta-text">
                    {(restTags.length > 0 ? restTags : post.tags ?? []).map(
                      (tag, i) => (
                        <span key={tag}>
                          {i > 0 && <span className="meta-sep">/</span>}
                          <a href={`/tags/${encodeURIComponent(tag)}`}>{tag}</a>
                        </span>
                      )
                    )}
                  </span>
                </div>
              )}
            </div>

            <hr className="post-divider" />

            {post.series && seriesPosts && seriesPosts.length > 1 && (
              <PostSeries
                seriesName={post.series}
                posts={seriesPosts}
                currentSlug={post.slug}
              />
            )}

            <ArticleContent html={post.contentHtml} />

            <div className="post-divider" style={{ marginTop: "1.5rem" }} />
            <ShareButtons title={post.title} url={postUrl} />
          </div>
        </article>

        <PostNav
          prev={prev}
          next={next}
          labels={{ prev: t("post.prev"), next: t("post.next") }}
        />

        {post.tags && post.tags.length > 0 && (
          <RelatedPosts
            currentSlug={post.slug}
            currentTags={post.tags}
            allPosts={allPosts}
          />
        )}

        <Comments />
        <Donate />
        <Subscribe />
      </PageShell>
    </>
  );
}
