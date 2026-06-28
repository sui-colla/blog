"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function AboutContent() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-500 transition-colors mb-8"
      >
        &larr; {t("post.backHome")}
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          {t("about.title")}
        </span>
      </h1>
      <div className="prose max-w-none mt-8">
        <p>{t("about.intro")}</p>
        <p>{t("about.bio")}</p>
        <h2>{t("about.contact")}</h2>
        <p>{t("about.contactDesc")}</p>
      </div>
    </div>
  );
}
