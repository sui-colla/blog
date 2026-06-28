import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, getAdjacentPosts, getPostsBySeries } from "@/lib/posts";
import PostContent from "@/components/PostContent";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

const SITE_URL = "https://lunapath.dev"; // TODO: 替换为实际域名

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "未找到" };

  const ogImageUrl = `${SITE_URL}/api/og?slug=${encodeURIComponent(slug)}`;

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article" as const,
      url: `${SITE_URL}/posts/${slug}`,
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
      card: "summary_large_image" as const,
      title: post.title,
      description: post.summary,
      images: [ogImageUrl],
    },
  };
}

function buildArticleJsonLd(post: Awaited<ReturnType<typeof getPostBySlug>>, slug: string) {
  if (!post) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_URL}/posts/${slug}`,
    image: `${SITE_URL}/api/og?slug=${encodeURIComponent(slug)}`,
    author: {
      "@type": "Person",
      name: "LunaPath",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "LunaPath",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/posts/${slug}`,
    },
    wordCount: post.wordCount,
    keywords: post.tags?.join(", "),
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PostContent post={post} allPosts={allPosts} prev={prev} next={next} seriesPosts={seriesPosts} />
    </>
  );
}
