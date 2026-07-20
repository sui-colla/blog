"use client";

/**
 * 顶部导航栏
 *
 * - sticky 定位，滚动时半透明毛玻璃效果（backdrop-blur）
 * - 桌面端显示完整导航链接，移动端由 Sidebar 提供导航
 * - 集成 Search（⌘K）、ThemeToggle、LanguageToggle
 */
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Search from "@/components/Search";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/tags", label: t("nav.tags") },
    { href: "/archive", label: t("nav.archive") },
  ];

  return (
    <header className="site-header">
      <nav className="site-header__inner" aria-label={t("nav.explore")}>
        <Link
          href="/"
          className="site-header__brand"
        >
          {siteConfig.name}
        </Link>
        <div className="site-header__desktop-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="site-header__link">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="site-header__actions">
          <Search />
          <ThemeToggle />
          <LanguageToggle />
          <button
            type="button"
            className="icon-button site-header__menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div id="mobile-navigation" className="mobile-navigation">
          <div className="mobile-navigation__inner">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-navigation__link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
