import type { Metadata } from "next";
import NowContent from "@/components/content/NowContent";
import { nowPage } from "@/config/content-pages";
import { getSidebarData } from "@/lib/content/sidebar";

export const metadata: Metadata = {
  title: "Now",
  description: "Xingye 最近在学习、创作和关注的事情。",
};

export default function NowPage() {
  const { tags, popularPosts } = getSidebarData();
  return <NowContent data={nowPage} tags={tags} popularPosts={popularPosts} />;
}
