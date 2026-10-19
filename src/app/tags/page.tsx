import { getAllTags } from "@/lib/content/posts";
import { getSidebarData } from "@/lib/content/sidebar";
import TagsContent from "@/components/content/TagsContent";

export const metadata = {
  title: "标签",
  description: "按标签浏览文章",
};

export default function TagsPage() {
  const tags = getAllTags();
  const sidebar = getSidebarData();
  return <TagsContent tags={tags} popularPosts={sidebar.popularPosts} />;
}
