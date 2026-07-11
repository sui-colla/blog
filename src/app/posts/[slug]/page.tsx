/**
 * 文章详情页（/[slug]）
 *
 * - generateStaticParams: 构建时预生成所有已发布文章的静态 HTML（SSG）
 * - generateMetadata: 为每篇文章生成独立的 SEO 元数据（Open Graph / Twitter Card）
 * - PostContent 组件处理客户端交互（目录高亮、代码复制、灯箱等）
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, getAdjacentPosts, getPostsBySeries } from "@/lib/posts";
import { absoluteUrl } from "@/config/site";
import { buildArticleJsonLd, serializeJsonLd } from "@/lib/structured-data";
import PostContent from "@/components/PostContent";

// SSG：构建时遍历所有文章 slug 生成静态页面
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "未找到" };

  const postUrl = absoluteUrl(`/posts/${slug}`);
  const ogImageUrl = absoluteUrl(`/api/og?slug=${encodeURIComponent(slug)}`);

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: postUrl,
      publishedTime: post.date,
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = getAllPosts();
  const { prev, next } = getAdjacentPosts(slug);
  const jsonLd = buildArticleJsonLd(post, slug);
  const seriesPosts = post.series ? getPostsBySeries(post.series) : undefined;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      )}
      <PostContent post={post} allPosts={allPosts} prev={prev} next={next} seriesPosts={seriesPosts} />
    </>
  );
}
