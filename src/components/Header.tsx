"use client";

import Link from "next/link";
import Search from "@/components/Search";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-orange-500 hover:text-orange-600 transition-colors"
        >
          LunaPath
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-zinc-500">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/about" className="hover:text-orange-500 transition-colors">
            {t("nav.about")}
          </Link>
          <Link href="/tags" className="hover:text-orange-500 transition-colors">
            {t("nav.tags")}
          </Link>
          <Search />
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}
