import type { Metadata } from "next";
import UsesContent from "@/components/content/UsesContent";
import { usesCategories } from "@/config/content-pages";
import { getSidebarData } from "@/lib/content/sidebar";

export const metadata: Metadata = {
  title: "Uses",
  description: "Xingye 正在使用和推荐的开发工具、软件、设备与服务。",
};

export default function UsesPage() {
  const { tags, popularPosts } = getSidebarData();
  return (
    <UsesContent
      categories={usesCategories}
      tags={tags}
      popularPosts={popularPosts}
    />
  );
}
