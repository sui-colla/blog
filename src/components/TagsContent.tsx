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
        <span className="text-zinc-950 dark:text-zinc-50">
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
            className="group inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:hover:bg-teal-900/40"
          >
            {tag}
            <span className="text-xs text-teal-400 dark:text-teal-500">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
