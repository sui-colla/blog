"use client";

/**
 * 首页左侧边栏
 *
 * 实际渲染三块：导航链接（首页 / 关于）、热门文章排行（取前 4 篇）、文章统计。
 * 桌面端固定在首页左侧；移动端由 HomeContent 底部的 discover 区块
 * 另外渲染热门文章与标签云，不复用本组件。
 * 通过 usePathname() 高亮当前所在页面的导航项。
 *
 * 注：globals.css 里仍保留着 .sidebar-tags / .sidebar-tag / .sidebar-tag-count
 * 三段样式，但标签云实际由 HomeContent 用 .home-topic-list / .home-topic-link
 * 实现，本组件只取 tags.length 做统计 —— 那三段是另一套没用上的写法。
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
