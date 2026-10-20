"use client";

/**
 * 顶部导航（对应 Fuwari Navbar.astro）
 *
 * 白色卡片贴在视口顶端，只有下方两个圆角；左侧品牌使用主色，
 * 中间导航为 btn-plain，右侧是搜索（桌面框/移动按钮）/ 色相 / 主题 / 语言 / 移动端菜单。
 * 移动端菜单是 fixed right-4 的 float-panel，每行右侧带箭头（Fuwari NavMenuPanel）。
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronRight, Home, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Search from "@/components/ui/Search";
import HuePicker from "@/components/ui/HuePicker";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/archive", label: t("nav.archive") },
    { href: "/about", label: t("nav.about") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="navbar-wrap">
      <nav className="navbar">
        <Link href="/" className="navbar__brand btn-plain" aria-label={siteConfig.name}>
          <Home aria-hidden="true" strokeWidth={1.8} />
          <span>{siteConfig.name}</span>
        </Link>

        <div className="navbar__links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar__link btn-plain${isActive(item.href) ? " is-active" : ""}`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/sui-colla"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__link btn-plain"
          >
            GitHub
            <ArrowUpRight className="external-icon" aria-hidden="true" size={14} />
          </a>
        </div>

        <div className="navbar__actions">
          <Search />
          <HuePicker />
          <ThemeToggle />
          <LanguageToggle />
          <button
            type="button"
            className="btn-plain icon-btn navbar__menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>

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
                  <ChevronRight size={20} aria-hidden="true" />
                </Link>
              ))}
              <a
                href="https://github.com/sui-colla"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-navigation__link"
                onClick={() => setMenuOpen(false)}
              >
                GitHub
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
