"use client";

/**
 * 归档页（对应 Fuwari ArchivePanel.svelte）
 *
 * 卡片内按年份分组：年份 / 主色圆点 / 文章数，
 * 每条记录是「日期 / 虚线时间轴 / 标题 / 标签」。
 */
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";

interface Props {
  groups: Record<string, PostMeta[]>;
  sortedKeys: string[];
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

interface YearGroup {
  year: string;
  posts: PostMeta[];
}

export default function ArchiveContent({
  groups,
  sortedKeys,
  tags = [],
  popularPosts = [],
}: Props) {
  const { t } = useI18n();

  const years: YearGroup[] = [];
  for (const key of sortedKeys) {
    const year = key.split("-")[0];
    const list = groups[key];
    const existing = years.find((item) => item.year === year);
    if (existing) {
      existing.posts.push(...list);
    } else {
      years.push({ year, posts: [...list] });
    }
  }

  const formatMMDD = (date: string) => {
    const d = new Date(date);
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base archive-card">
        {years.length === 0 ? (
          <p className="empty-state">{t("home.empty")}</p>
        ) : (
          years.map((group) => (
            <div key={group.year}>
              <div className="archive-year-row">
                <div className="archive-year">{group.year}</div>
                <div className="archive-year-dot-wrap">
                  <div className="archive-year-dot" />
                </div>
                <div className="archive-year-count">
                  {group.posts.length} {t("sidebar.posts")}
                </div>
              </div>

              {group.posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="archive-row btn-plain"
                  aria-label={post.title}
                >
                  <div className="archive-row__inner">
                    <div className="archive-row__date">{formatMMDD(post.date)}</div>
                    <div className="archive-row__line">
                      <div className="archive-row__dot" />
                    </div>
                    <div className="archive-row__title">{post.title}</div>
                    <div className="archive-row__tags">
                      {(post.tags ?? []).map((tag) => `#${tag}`).join(" ")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))
        )}
      </div>
    </PageShell>
  );
}
