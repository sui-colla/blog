"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { UsesCategory } from "@/config/content-pages";

interface Props {
  categories: UsesCategory[];
}

export default function UsesContent({ categories }: Props) {
  const { t } = useI18n();
  const visibleCategories = categories.filter((category) => category.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-teal-500">
        &larr; {t("post.backHome")}
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="text-zinc-950 dark:text-zinc-50">
          {t("uses.title")}
        </span>
      </h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">{t("uses.description")}</p>

      {visibleCategories.length === 0 ? (
        <div className="mt-10 rounded-md border border-dashed border-teal-200 bg-teal-50/60 p-8 text-center text-sm text-zinc-500 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-zinc-400">
          {t("uses.empty")}
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {visibleCategories.map((category) => (
            <section key={category.title}>
              <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">{category.title}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {category.items.map((item) => (
                  <article key={item.name} className="rounded-md border border-teal-100 bg-white/80 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{item.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 dark:text-teal-400">
                          {t("uses.visit")} ↗
                        </a>
                      )}
                      {item.postUrl && (
                        <Link href={item.postUrl} className="text-teal-600 hover:text-teal-700 dark:text-teal-400">
                          {t("uses.readPost")} →
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
