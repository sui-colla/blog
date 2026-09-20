import { getAllTags } from "@/lib/content/posts";
import TagsContent from "@/components/content/TagsContent";

export const metadata = {
  title: "标签",
  description: "按标签浏览文章",
};

export default function TagsPage() {
  const tags = getAllTags();
  return <TagsContent tags={tags} />;
}
