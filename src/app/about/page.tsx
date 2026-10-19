import type { Metadata } from "next";
import AboutContent from "@/components/content/AboutContent";
import { getSidebarData } from "@/lib/content/sidebar";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 Xingye 和这个博客的说明。",
};

export default function AboutPage() {
  const { tags, popularPosts } = getSidebarData();
  return <AboutContent tags={tags} popularPosts={popularPosts} />;
}
