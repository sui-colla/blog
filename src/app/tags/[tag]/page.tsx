import { notFound } from "next/navigation";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import TagDetailContent from "@/components/TagDetailContent";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return {
    title: `标签：${tag}`,
    description: `包含「${tag}」标签的所有文章`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return <TagDetailContent tag={tag} posts={posts} />;
}
