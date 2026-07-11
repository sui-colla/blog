"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function OfflineContent() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6 py-16 text-center sm:py-24">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-500">
        {t("offline.badge")}
      </p>
      <h1 className="mt-4 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
        {t("offline.title")}
      </h1>
      <p className="mt-5 text-zinc-600 dark:text-zinc-400">
        {t("offline.desc")}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
        >
          {t("offline.backHome")}
        </Link>
        <a
          href="."
          className="rounded-full border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 dark:border-orange-900/70 dark:text-orange-300 dark:hover:bg-orange-950/40"
        >
          {t("offline.reload")}
        </a>
      </div>
    </div>
  );
}
