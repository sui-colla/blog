"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

interface Tag {
  tag: string;
  count: number;
}

interface Props {
  tags: Tag[];
}

export default function Sidebar({ tags }: Props) {
  const { t } = useI18n();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("nav.home"), icon: "🏠" },
    { href: "/about", label: t("nav.about"), icon: "👤" },
    { href: "/tags", label: t("nav.tags"), icon: "🏷️" },
    { href: "/archive", label: t("nav.archive"), icon: "📚" },
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
          <span className="sidebar-stat-value">6</span>
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
