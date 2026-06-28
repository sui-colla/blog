"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface Props {
  tags: { tag: string; count: number }[];
}

export default function TagsContent({ tags }: Props) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          {t("tags.title")}
        </span>
      </h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        {t("tags.description")}
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="group inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40"
          >
            {tag}
            <span className="text-xs text-orange-400 dark:text-orange-500">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
