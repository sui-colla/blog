"use client";

/**
 * 首页（对应 Fuwari index.astro）：
 * 文章卡片列表 + 分页，外层是 MainGridLayout（侧栏 + 内容列）。
 */
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PostCard from "@/components/content/PostCard";
import HomeBanner from "@/components/content/HomeBanner";
import { useI18n } from "@/lib/i18n";
import type { PostMeta } from "@/lib/content/posts";

interface Tag {
  tag: string;
  count: number;
}

interface Props {
  posts: PostMeta[];
  tags: Tag[];
  popularPosts: PostMeta[];
  page?: number;
}

const POSTS_PER_PAGE = 8;
const HIDDEN = -1;

function buildPages(current: number, last: number): number[] {
  let count = 1;
  let l = current;
  let r = current;
  const VISIBLE = 5;
  while (l > 1 && r < last && count + 2 <= VISIBLE) {
    count += 2;
    l -= 1;
    r += 1;
  }
  while (l > 1 && count < VISIBLE) {
    count += 1;
    l -= 1;
  }
  while (r < last && count < VISIBLE) {
    count += 1;
    r += 1;
  }

  const pages: number[] = [];
  if (l > 1) pages.push(1);
  if (l === 3) pages.push(2);
  if (l > 3) pages.push(HIDDEN);
  for (let i = l; i <= r; i += 1) pages.push(i);
  if (r < last - 2) pages.push(HIDDEN);
  if (r === last - 2) pages.push(last - 1);
  if (r < last) pages.push(last);
  return pages;
}

export default function HomeContent({
  posts,
  tags,
  popularPosts,
  page = 1,
}: Props) {
  const { t } = useI18n();
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE);
  const pages = buildPages(currentPage, totalPages);

  return (
    <div className="home-page">
      <HomeBanner />
      <PageShell tags={tags} popularPosts={popularPosts}>
        {pagePosts.length === 0 ? (
          <div className="empty-state">{t("home.empty")}</div>
        ) : (
          /* 两列方块网格：桌面端 2 列，窄屏回落为单列 */
          <div className="post-grid">
            {pagePosts.map((post, index) => (
              <PostCard
                key={post.slug}
                post={post}
                index={index}
                variant="tile"
                showDivider={false}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="pagination" aria-label={t("pagination.aria")}>
            {currentPage > 1 ? (
              <Link
                href={`/?page=${currentPage - 1}`}
                className="pagination__arrow btn-card"
                aria-label={t("pagination.prev")}
              >
                <ChevronLeft size={26} aria-hidden="true" />
              </Link>
            ) : (
              <span className="pagination__arrow btn-card disabled" aria-hidden="true">
                <ChevronLeft size={26} />
              </span>
            )}

            <div className="pagination__pages">
              {pages.map((p, index) =>
                p === HIDDEN ? (
                  <span key={`hidden-${index}`} className="pagination__page">
                    …
                  </span>
                ) : p === currentPage ? (
                  <span key={p} className="pagination__page pagination__page--current">
                    {p}
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={p === 1 ? "/" : `/?page=${p}`}
                    className="pagination__page btn-card"
                    aria-label={`${t("pagination.next")} ${p}`}
                  >
                    {p}
                  </Link>
                )
              )}
            </div>

            {currentPage < totalPages ? (
              <Link
                href={`/?page=${currentPage + 1}`}
                className="pagination__arrow btn-card"
                aria-label={t("pagination.next")}
              >
                <ChevronRight size={26} aria-hidden="true" />
              </Link>
            ) : (
              <span className="pagination__arrow btn-card disabled" aria-hidden="true">
                <ChevronRight size={26} />
              </span>
            )}
          </nav>
        )}
      </PageShell>
    </div>
  );
}
