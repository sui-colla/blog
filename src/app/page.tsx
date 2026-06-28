import { getAllPosts, getAllTags } from "@/lib/posts";
import HomeContent from "@/components/HomeContent";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const posts = getAllPosts();
  const tags = getAllTags();
  return <HomeContent posts={posts} tags={tags} page={Number(page) || 1} />;
}
