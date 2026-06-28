import { getAllPosts, getAllTags } from "@/lib/posts";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return <HomeContent posts={posts} tags={tags} />;
}
