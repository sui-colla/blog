"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFoundContent() {
  const { t } = useI18n();

  return (
    <div className="main-wrap">
      <div className="card-base not-found">
        <p className="not-found__code">404</p>
        <h1 className="page-title" style={{ marginTop: "0.5rem" }}>
          {t("notFound.title")}
        </h1>
        <p className="page-lead" style={{ maxWidth: "28rem", margin: "0.5rem auto 0" }}>
          {t("notFound.desc")}
        </p>
        <div className="not-found__actions">
          <Link href="/" className="tag-chip">
            {t("notFound.backHome")}
          </Link>
          <Link href="/archive" className="tag-chip">
            {t("browse.archive")}
          </Link>
        </div>
      </div>
    </div>
  );
}
