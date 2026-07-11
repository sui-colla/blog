"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { LinksPageData } from "@/config/content-pages";

interface Props {
  data: LinksPageData;
}

function getInitial(name: string) {
  return name.trim().slice(0, 1).toUpperCase();
}

export default function LinksContent({ data }: Props) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-orange-500">
        &larr; {t("post.backHome")}
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          {t("links.title")}
        </span>
      </h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">{t("links.description")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5 text-sm leading-6 text-zinc-600 dark:border-orange-900/40 dark:bg-orange-950/20 dark:text-zinc-400">
          <h2 className="mb-2 font-bold text-zinc-900 dark:text-zinc-50">{t("links.exchange")}</h2>
          {data.exchangeNote}
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-5 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
          <h2 className="mb-2 font-bold text-zinc-900 dark:text-zinc-50">{t("links.broken")}</h2>
          {data.brokenLinkNote}
        </div>
      </div>

      {data.links.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center text-sm text-zinc-500 dark:border-orange-900/50 dark:bg-orange-950/20 dark:text-zinc-400">
          {t("links.empty")}
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {data.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-orange-900/60"
            >
              <div className="flex items-start gap-4">
                {link.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={link.avatar} alt={`${link.name} avatar`} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                    {getInitial(link.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <h2 className="font-bold text-zinc-900 transition group-hover:text-orange-600 dark:text-zinc-50 dark:group-hover:text-orange-300">
                    {link.name} ↗
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{link.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
