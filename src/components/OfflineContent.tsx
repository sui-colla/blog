"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function OfflineContent() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6 py-16 text-center sm:py-24">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-teal-500">
        {t("offline.badge")}
      </p>
      <h1 className="mt-4 text-4xl font-bold text-zinc-950 dark:text-zinc-50 sm:text-5xl">
        {t("offline.title")}
      </h1>
      <p className="mt-5 text-zinc-600 dark:text-zinc-400">
        {t("offline.desc")}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:bg-teal-600"
        >
          {t("offline.backHome")}
        </Link>
        <a
          href="."
          className="rounded-full border border-teal-200 px-5 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-900/70 dark:text-teal-300 dark:hover:bg-teal-950/40"
        >
          {t("offline.reload")}
        </a>
      </div>
    </div>
  );
}
