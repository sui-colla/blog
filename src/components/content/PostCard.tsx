"use client";

/**
 * 文章卡片（对应 Fuwari PostCard.astro）
 *
 * list：默认横向卡片，右侧显示进入按钮，卡片之间用虚线分隔。
 * tile：两列方块网格专用，信息按“分类—标题—摘要—标签/统计”纵向排布。
 */
import Link from "next/link";
import { Calendar, ChevronRight, Folder, Tag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";

interface Props {
  post: PostMeta;
  index?: number;
  showDivider?: boolean;
  variant?: "list" | "tile";
}

export default function PostCard({
  post,
  index = 0,
  showDivider = true,
  variant = "list",
}: Props) {
  const { t } = useI18n();
  const [category, ...restTags] = post.tags ?? [];
  const tags = restTags.length > 0 ? restTags : (post.tags ?? []);

  if (variant === "tile") {
    return (
      <article
        className="post-card post-card--tile onload-animation"
        style={{ animationDelay: `calc(var(--content-delay) + ${index * 60}ms)` }}
      >
        <div className="post-card__body">
          <div className="post-card__tile-top">
            {category ? (
              <Link
                href={`/tags/${encodeURIComponent(category)}`}
                className="post-card__category"
              >
                {category}
              </Link>
            ) : (
              <span className="post-card__category">{t("post.uncategorized")}</span>
            )}
            <time className="post-card__tile-date" dateTime={post.date}>
              {post.date}
            </time>
          </div>

          <Link href={`/posts/${post.slug}`} className="post-card__title">
            {post.title}
          </Link>

          <p className="post-card__desc">{post.summary}</p>

          <div className="post-card__tile-footer">
            <div className="post-card__tile-tags">
              {restTags.slice(0, 2).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="tag-chip"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <span className="post-card__tile-meta">
              {post.wordCount.toLocaleString()} {t("post.wordCount")} ·{" "}
              {post.readingTime} {t("post.readingTime")}
            </span>
          </div>

          <Link href={`/posts/${post.slug}`} className="post-card__tile-more">
            {t("home.readPost")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <>
      <article
        className="post-card onload-animation"
        style={{ animationDelay: `calc(var(--content-delay) + ${index * 50}ms)` }}
      >
        <div className="post-card__body">
          <Link href={`/posts/${post.slug}`} className="post-card__title">
            {post.title}
            {/* 移动端标题内联箭头（Fuwari: md:hidden translate-y-0.5） */}
            <ChevronRight className="title-chevron" aria-hidden="true" strokeWidth={1.8} />
          </Link>

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
                <Link
                  href={`/tags/${encodeURIComponent(category)}`}
                  className="meta-text"
                >
                  {category}
                </Link>
              ) : (
                <span className="meta-text">{t("post.uncategorized")}</span>
              )}
            </div>

            {tags.length > 0 && (
              <div className="meta-item">
                <span className="meta-icon" aria-hidden="true">
                  <Tag size={15} />
                </span>
                <span className="meta-text">
                  {tags.map((tag, i) => (
                    <span key={tag}>
                      {i > 0 && <span className="meta-sep">/</span>}
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          <p className="post-card__desc">{post.summary}</p>

          <div className="post-card__stats">
            <span>
              {post.wordCount.toLocaleString()} {t("post.wordCount")}
            </span>
            <span>|</span>
            <span>
              {post.readingTime} {t("post.readingTime")}
            </span>
          </div>
        </div>

        <Link
          href={`/posts/${post.slug}`}
          className="post-card__enter btn-regular"
          aria-label={post.title}
        >
          <ChevronRight aria-hidden="true" strokeWidth={1.8} />
        </Link>
      </article>
      {showDivider && <div className="post-card__divider" aria-hidden="true" />}
    </>
  );
}
