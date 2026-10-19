"use client";

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";

interface Props {
  tags: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

export default function TagsContent({ tags, popularPosts = [] }: Props) {
  const { t } = useI18n();

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base content-card">
        <h1 className="page-title">{t("tags.title")}</h1>
        <p className="page-lead">{t("tags.description")}</p>

        <div className="widget__chips" style={{ marginTop: "1.25rem" }}>
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="tag-chip"
              aria-label={`${tag} · ${count}`}
            >
              {tag}
              <span style={{ marginLeft: "0.4rem", opacity: 0.6 }}>{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
