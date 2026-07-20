"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFoundContent() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32 text-center">
      <h1 className="text-8xl font-extrabold tracking-tight">
        <span className="text-zinc-950 dark:text-zinc-50">
          404
        </span>
      </h1>
      <h2 className="mt-4 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
        {t("notFound.title")}
      </h2>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
        {t("notFound.desc")}
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors"
        >
          {t("notFound.backHome")}
        </Link>
        <Link
          href="/tags"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:border-teal-500 hover:text-teal-500 transition-colors"
        >
          {t("notFound.browseTags")}
        </Link>
      </div>
    </div>
  );
}
