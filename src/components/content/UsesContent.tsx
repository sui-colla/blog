"use client";

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";
import type { UsesCategory } from "@/config/content-pages";

interface Props {
  categories: UsesCategory[];
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

export default function UsesContent({
  categories,
  tags = [],
  popularPosts = [],
}: Props) {
  const { t } = useI18n();
  const visibleCategories = categories.filter(
    (category) => category.items.length > 0
  );

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base content-card">
        <h1 className="page-title">{t("uses.title")}</h1>
        <p className="page-lead">{t("uses.description")}</p>

        {visibleCategories.length === 0 ? (
          <p className="empty-state" style={{ marginTop: "1.5rem" }}>
            {t("uses.empty")}
          </p>
        ) : (
          visibleCategories.map((category) => (
            <div key={category.title} style={{ marginTop: "1.75rem" }}>
              <h2 className="section-title">{category.title}</h2>
              <div className="card-grid">
                {category.items.map((item) => (
                  <article key={item.name} className="entry-card">
                    <h3 className="entry-card__title">{item.name}</h3>
                    <p className="entry-card__desc">{item.description}</p>
                    <div className="entry-card__links">
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          {t("uses.visit")} ↗
                        </a>
                      )}
                      {item.postUrl && (
                        <Link href={item.postUrl}>{t("uses.readPost")} →</Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </PageShell>
  );
}
