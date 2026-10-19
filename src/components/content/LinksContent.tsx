"use client";

import PageShell from "@/components/layout/PageShell";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";
import type { LinksPageData } from "@/config/content-pages";

interface Props {
  data: LinksPageData;
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

function getInitial(name: string) {
  return name.trim().slice(0, 1).toUpperCase();
}

export default function LinksContent({
  data,
  tags = [],
  popularPosts = [],
}: Props) {
  const { t } = useI18n();

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base content-card">
        <h1 className="page-title">{t("links.title")}</h1>
        <p className="page-lead">{t("links.description")}</p>

        <div className="card-grid" style={{ marginTop: "1.5rem" }}>
          <div className="entry-card">
            <h2 className="entry-card__title">{t("links.exchange")}</h2>
            <p className="entry-card__desc">{data.exchangeNote}</p>
          </div>
          <div className="entry-card">
            <h2 className="entry-card__title">{t("links.broken")}</h2>
            <p className="entry-card__desc">{data.brokenLinkNote}</p>
          </div>
        </div>

        {data.links.length === 0 ? (
          <p className="empty-state" style={{ marginTop: "1.5rem" }}>
            {t("links.empty")}
          </p>
        ) : (
          <div className="card-grid" style={{ marginTop: "1.5rem" }}>
            {data.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="entry-card"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {link.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={link.avatar}
                      alt={`${link.name} avatar`}
                      width={36}
                      height={36}
                      style={{ borderRadius: "0.5rem" }}
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="btn-regular"
                      style={{ width: "2.25rem", height: "2.25rem" }}
                      aria-hidden="true"
                    >
                      {getInitial(link.name)}
                    </span>
                  )}
                  <h2 className="entry-card__title" style={{ margin: 0 }}>
                    {link.name} ↗
                  </h2>
                </div>
                <p className="entry-card__desc">{link.description}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
