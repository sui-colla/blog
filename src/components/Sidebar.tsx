"use client";

/**
 * 首页左侧边栏
 *
 * 包含导航链接（首页/关于）、探索区（项目/Now/链接/Uses）、热门文章排行、
 * 标签云、浏览导航（所有标签/按时间归档）和文章统计。
 * 桌面端固定在首页左侧，移动端内容折叠到 HomeContent 底部显示。
 * 通过 usePathname() 高亮当前所在页面的导航项。
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UserRound } from "lucide-react";
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
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/about", label: t("nav.about"), icon: UserRound },
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
              <item.icon className="sidebar-link-icon" size={15} aria-hidden="true" />
              {item.label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="sidebar-divider" />

      {/* 热门文章 */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">{t("popular.title")}</h3>
        {popularPosts.length > 0 ? (
          <ol className="sidebar-popular-list">
          {popularPosts.slice(0, 4).map((post, index) => (
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

      {/* 统计信息 */}
      <div className="sidebar-divider" />
      <div className="sidebar-stats">
        <div className="sidebar-stat">
          <span className="sidebar-stat-value">{postCount}</span>
          <span className="sidebar-stat-label">{t("sidebar.posts")}</span>
        </div>
        <div className="sidebar-stat">
          <span className="sidebar-stat-value">{tags.length}</span>
          <span className="sidebar-stat-label">{t("sidebar.tags")}</span>
        </div>
      </div>
    </aside>
  );
}
