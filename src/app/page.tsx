/**
 * 首页（Server Component）
 *
 * 服务端预取文章列表、标签、热门文章数据，传递给客户端 HomeContent 组件渲染。
 * 分页通过 ?page=N 查询参数实现，由 searchParams 读取。
 */
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
