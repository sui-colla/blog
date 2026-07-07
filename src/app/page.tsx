import { getAllPosts, getAllTags, getPopularPosts } from "@/lib/posts";
import HomeContent from "@/components/HomeContent";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const posts = getAllPosts();
  const tags = getAllTags();
  const popularPosts = getPopularPosts(5);

  return (
    <HomeContent
      posts={posts}
      tags={tags}
      popularPosts={popularPosts}
      page={Number(page) || 1}
    />
  );
}
