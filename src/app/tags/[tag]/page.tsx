import { notFound } from "next/navigation";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import TagDetailContent from "@/components/TagDetailContent";

/**
 * 解码动态段。
 *
 * Next.js 16 传进来的 params 是百分号编码的：中文标签会拿到
 * "%E6%8A%80%E6%9C%AF" 而不是 "技术"。getPostsByTag 用的是精确匹配，
 * 拿编码串去比就一篇都匹配不到 → notFound()，整个中文标签页变成 404。
 * ASCII 标签（CS2 / PLC / Next.js…）编码前后一样，所以一直看不出问题，
 * 直到有中文标签才会暴露。
 *
 * 标签理论上可能含字面量 "%"，所以 decodeURIComponent 要兜住异常。
 */
function decodeTagParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeTagParam(tag);
  return {
    title: `标签：${decoded}`,
    description: `包含「${decoded}」标签的所有文章`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeTagParam(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) notFound();

  return <TagDetailContent tag={decoded} posts={posts} />;
}
