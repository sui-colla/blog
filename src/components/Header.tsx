"use client";

/**
 * 顶部导航栏
 *
 * - sticky 定位，滚动时半透明毛玻璃效果（backdrop-blur）
 * - 桌面端显示完整导航链接，移动端由 Sidebar 提供导航
 * - 集成 Search（⌘K）、ThemeToggle、LanguageToggle
 */
import Link from "next/link";
import Search from "@/components/Search";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6" aria-label={t("nav.explore")}>
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-orange-500 hover:text-orange-600 transition-colors"
        >
          {siteConfig.name}
        </Link>
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-zinc-500 sm:gap-3 md:gap-5">
          <div className="hidden items-center gap-5 md:flex">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/about" className="hover:text-orange-500 transition-colors">
              {t("nav.about")}
            </Link>
            <Link href="/projects" className="hover:text-orange-500 transition-colors">
              {t("nav.projects")}
            </Link>
            <Link href="/tags" className="hover:text-orange-500 transition-colors">
              {t("nav.tags")}
            </Link>
            <Link href="/archive" className="hover:text-orange-500 transition-colors">
              {t("nav.archive")}
            </Link>
          </div>
          <Search />
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}
