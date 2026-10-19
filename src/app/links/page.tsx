import type { Metadata } from "next";
import LinksContent from "@/components/content/LinksContent";
import { linksPage } from "@/config/content-pages";
import { getSidebarData } from "@/lib/content/sidebar";

export const metadata: Metadata = {
  title: "链接",
  description: "Xingye 收藏和推荐的链接，以及友情链接说明。",
};

export default function LinksPage() {
  const { tags, popularPosts } = getSidebarData();
  return (
    <LinksContent data={linksPage} tags={tags} popularPosts={popularPosts} />
  );
}
