"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/posts";

interface Props {
  groups: Record<string, PostMeta[]>;
  sortedKeys: string[];
}

export default function ArchiveContent({ groups, sortedKeys }: Props) {
  const { t, locale } = useI18n();

  const monthNames: Record<string, string[]> = {
    zh: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-500 transition-colors mb-8"
      >
        &larr; {t("post.backHome")}
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-10">
        <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          {locale === "zh" ? "文章归档" : "Archive"}
        </span>
      </h1>

      <div className="archive-timeline">
        {sortedKeys.map((key, index) => {
          const [year, month] = key.split("-");
          const previousYear = index > 0 ? sortedKeys[index - 1].split("-")[0] : "";
          const showYear = year !== previousYear;

          return (
            <div key={key}>
              {showYear && (
                <h2 className="archive-year">{year}</h2>
              )}
              <div className="archive-month-group">
                <h3 className="archive-month">
                  {monthNames[locale][parseInt(month) - 1]}
                </h3>
                <ul className="archive-posts">
                  {groups[key].map((post) => (
                    <li key={post.slug} className="archive-post-item">
                      <span className="archive-post-date">
                        {new Date(post.date).getDate()} {locale === "zh" ? "日" : ""}
                      </span>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="archive-post-link"
                      >
                        {post.title}
                      </Link>
                      {post.tags && post.tags.length > 0 && (
                        <div className="archive-post-tags">
                          {post.tags.map((tag) => (
                            <Link
                              key={tag}
                              href={`/tags/${encodeURIComponent(tag)}`}
                              className="archive-post-tag"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
