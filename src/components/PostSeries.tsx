"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/posts";

interface Props {
  seriesName: string;
  posts: PostMeta[];
  currentSlug: string;
}

export default function PostSeries({ seriesName, posts, currentSlug }: Props) {
  const { t } = useI18n();

  // 按日期正序排列（系列文章从旧到新）
  const sorted = [...posts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="post-series">
      <h3 className="post-series-title">
        📚 {t("series.title")}：{seriesName}
      </h3>
      <ol className="post-series-list">
        {sorted.map((post, idx) => (
          <li key={post.slug} className="post-series-item">
            <span className="post-series-num">{idx + 1}</span>
            {post.slug === currentSlug ? (
              <span className="post-series-current">{post.title}</span>
            ) : (
              <Link
                href={`/posts/${post.slug}`}
                className="post-series-link"
              >
                {post.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
