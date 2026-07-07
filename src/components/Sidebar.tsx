"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/posts";

interface Tag {
  tag: string;
  count: number;
}

interface Props {
  tags: Tag[];
  postCount: number;
  popularPosts: PostMeta[];
}

export default function Sidebar({ tags, postCount, popularPosts }: Props) {
  const { t } = useI18n();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("nav.home"), icon: "🏠" },
    { href: "/about", label: t("nav.about"), icon: "👤" },
    { href: "/tags", label: t("nav.tags"), icon: "🏷️" },
    { href: "/archive", label: t("nav.archive"), icon: "📚" },
  ];

  const exploreItems = [
    { href: "/projects", label: t("nav.projects"), icon: "✨" },
    { href: "/now", label: t("nav.now"), icon: "🌿" },
    { href: "/links", label: t("nav.links"), icon: "🔗" },
    { href: "/uses", label: t("nav.uses"), icon: "🧰" },
  ];

  return (
    <aside className="sidebar">
      {/* 导航链接 */}
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <div key={item.href}>
            {index > 0 && <div className="sidebar-nav-divider" />}
            <Link
              href={item.href}
              className={`sidebar-link ${
                pathname === item.href ? "sidebar-link--active" : ""
              }`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">{t("nav.explore")}</h3>
        <nav className="sidebar-nav" aria-label={t("nav.explore")}>
          {exploreItems.map((item, index) => (
            <div key={item.href}>
              {index > 0 && <div className="sidebar-nav-divider" />}
              <Link
                href={item.href}
                className={`sidebar-link ${
                  pathname === item.href ? "sidebar-link--active" : ""
                }`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* 分割线 */}
      <div className="sidebar-divider" />

      {/* 热门文章 */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">{t("popular.title")}</h3>
        {popularPosts.length > 0 ? (
          <ol className="sidebar-popular-list">
            {popularPosts.map((post, index) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="sidebar-popular-link">
                  <span className="sidebar-popular-rank">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="sidebar-popular-content">
                    <span className="sidebar-popular-title">{post.title}</span>
                    <span className="sidebar-popular-meta">
                      {post.readingTime} {t("post.readingTime")}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="sidebar-empty">{t("popular.empty")}</p>
        )}
      </div>

      {/* 分割线 */}
      <div className="sidebar-divider" />

      {/* 标签列表 */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">{t("nav.tags")}</h3>
        <div className="sidebar-tags">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="sidebar-tag"
            >
              {tag}
              <span className="sidebar-tag-count">{count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="sidebar-divider" />
      <div className="sidebar-stats">
        <div className="sidebar-stat">
          <span className="sidebar-stat-value">{postCount}</span>
          <span className="sidebar-stat-label">文章</span>
        </div>
        <div className="sidebar-stat">
          <span className="sidebar-stat-value">{tags.length}</span>
          <span className="sidebar-stat-label">标签</span>
        </div>
      </div>
    </aside>
  );
}
