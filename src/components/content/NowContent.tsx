"use client";

import PageShell from "@/components/layout/PageShell";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";
import type { NowPageData } from "@/config/content-pages";

interface Props {
  data: NowPageData;
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

export default function NowContent({
  data,
  tags = [],
  popularPosts = [],
}: Props) {
  const { t, locale } = useI18n();
  const updated = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(data.updatedAt));

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base content-card">
        <h1 className="page-title">{t("now.title")}</h1>
        <p className="page-lead">{t("now.description")}</p>
        <p className="meta-text" style={{ marginTop: "0.75rem" }}>
          {t("now.updatedAt").replace("{date}", updated)}
        </p>

        {data.sections.length === 0 ? (
          <p className="empty-state" style={{ marginTop: "1.5rem" }}>
            {t("now.empty")}
          </p>
        ) : (
          <div className="card-grid" style={{ marginTop: "1.5rem" }}>
            {data.sections.map((section) => (
              <section key={section.title} className="entry-card">
                <h2 className="entry-card__title">{section.title}</h2>
                <ul className="clean-list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
