"use client";

/**
 * 页面骨架（对应 Fuwari MainGridLayout.astro）
 *
 * 左侧 17.5rem 侧栏 + 右侧内容列，整体宽度 75rem；
 * 小屏时侧栏移动到内容下方。
 */
import SideBar from "@/components/layout/SideBar";
import Footer from "@/components/layout/Footer";
import type { PostMeta, TocHeading } from "@/lib/content/posts";

interface Props {
  children: React.ReactNode;
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
  headings?: TocHeading[];
}

export default function PageShell({
  children,
  tags = [],
  popularPosts = [],
  headings = [],
}: Props) {
  return (
    <div className="main-wrap">
      <div className="main-grid">
        <SideBar tags={tags} popularPosts={popularPosts} headings={headings} />
        <div className="content-col">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}
