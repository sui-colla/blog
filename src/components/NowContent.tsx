"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { NowPageData } from "@/config/content-pages";

interface Props {
  data: NowPageData;
}

export default function NowContent({ data }: Props) {
  const { t, locale } = useI18n();
  const updated = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(data.updatedAt));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-orange-500">
        &larr; {t("post.backHome")}
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          {t("now.title")}
        </span>
      </h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">{t("now.description")}</p>
      <p className="mt-4 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-900/20 dark:text-orange-300">
        {t("now.updatedAt").replace("{date}", updated)}
      </p>

      {data.sections.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center text-sm text-zinc-500 dark:border-orange-900/50 dark:bg-orange-950/20 dark:text-zinc-400">
          {t("now.empty")}
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {data.sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-orange-100 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
