"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function OfflineContent() {
  const { t } = useI18n();

  return (
    <div className="main-wrap">
      <div className="card-base not-found">
        <h1 className="page-title">{t("offline.title")}</h1>
        <p className="page-lead" style={{ maxWidth: "30rem", margin: "0.5rem auto 0" }}>
          {t("offline.desc")}
        </p>
        <div className="not-found__actions">
          <Link href="/" className="tag-chip">
            {t("offline.backHome")}
          </Link>
          <a href="." className="tag-chip">
            {t("offline.reload")}
          </a>
        </div>
      </div>
    </div>
  );
}
