import { getAllPosts } from "@/lib/posts";
import ArchiveContent from "@/components/ArchiveContent";

export const metadata = {
  title: "归档",
  description: "所有文章按时间归档",
};

export default function ArchivePage() {
  const posts = getAllPosts();

  // 按年月分组
  const groups: Record<string, typeof posts> = {};
  for (const post of posts) {
    const d = new Date(post.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  }

  const sortedKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return <ArchiveContent groups={groups} sortedKeys={sortedKeys} />;
}
