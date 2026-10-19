"use client";

/**
 * 侧栏（对应 Fuwari SideBar.astro）
 *
 * Profile 卡固定在最上方，其余小工具（目录 / 标签 / 热门）在下方粘性跟随。
 */
import Link from "next/link";
import { Code2, Rss, User } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/lib/i18n";
import TableOfContents from "@/components/post/TableOfContents";
import type { PostMeta, TocHeading } from "@/lib/content/posts";

interface Tag {
  tag: string;
  count: number;
}

interface Props {
  tags?: Tag[];
  popularPosts?: PostMeta[];
  headings?: TocHeading[];
}

const iconMap = {
  user: User,
  rss: Rss,
  github: Code2,
} as const;

function Widget({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-base widget">
      <div className="widget__title">{title}</div>
      <div className="widget__body">{children}</div>
    </div>
  );
}

export default function SideBar({ tags = [], popularPosts = [], headings = [] }: Props) {
  const { t } = useI18n();

  return (
    <aside className="sidebar">
      <div className="sidebar__profile">
        <div className="card-base profile-card">
          <Link
            href="/about"
            className="profile-card__avatar-link"
            aria-label={t("nav.about")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.profile.avatar}
              alt={`${siteConfig.profile.name} avatar`}
              className="profile-card__avatar"
              width={512}
              height={512}
            />
          </Link>
          <div className="profile-card__inner">
            <div className="profile-card__name">{siteConfig.profile.name}</div>
            <div className="profile-card__rule" />
            <div className="profile-card__bio">{siteConfig.profile.bio}</div>
            <div className="profile-card__links">
              {siteConfig.profile.links.map((link) => {
                const Icon = iconMap[link.icon];
                const external = "external" in link && link.external;
                return external ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-regular profile-card__link"
                    aria-label={link.name}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="btn-regular profile-card__link"
                    aria-label={link.name}
                  >
                    <Icon aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar__sticky">
        {headings.length > 0 && (
          <Widget title={t("toc.title")}>
            <TableOfContents headings={headings} levels={[2, 3]} />
          </Widget>
        )}

        {tags.length > 0 && (
          <Widget title={t("nav.tags")}>
            <div className="widget__chips">
              {tags.map(({ tag }) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="tag-chip"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </Widget>
        )}

        {popularPosts.length > 0 && (
          <Widget title={t("popular.title")}>
            <div>
              {popularPosts.slice(0, 5).map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="widget-link"
                >
                  <span className="widget-link__label">{post.title}</span>
                  <span className="widget-link__badge">
                    {post.readingTime}
                  </span>
                </Link>
              ))}
            </div>
          </Widget>
        )}
      </div>
    </aside>
  );
}
