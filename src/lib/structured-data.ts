/**
 * JSON-LD 结构化数据（Schema.org）
 *
 * 为搜索引擎生成富文本摘要：
 * - buildWebsiteJsonLd: 全站级 WebSite + Person（站点名称、搜索框、作者）
 * - buildArticleJsonLd: 文章级 Article + BreadcrumbList（标题、日期、封面、作者）
 *
 * 通过 <script type="application/ld+json"> 注入到 <head> 中，
 * Google Rich Results Test 可验证输出是否正确。
 */
import { absoluteUrl, siteConfig } from "@/config/site";
import type { Post } from "@/lib/posts";

// @id 使用 fragment 形式，避免与真实 URL 冲突
const personId = `${siteConfig.url}/#person`;
const websiteId = `${siteConfig.url}/#website`;

/**
 * 序列化 JSON-LD 数据：转义 `<` 为 `<`，
 * 防止 JSON 中的 `</script>` 提前截断 <script> 标签导致 XSS。
 */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function buildAuthorPerson() {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.author.name,
    url: siteConfig.author.url,
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildAuthorPerson(),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        publisher: {
          "@id": personId,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function buildArticleJsonLd(post: Post, slug: string) {
  const postUrl = absoluteUrl(`/posts/${slug}`);
  const imageUrl = absoluteUrl(post.cover ?? `/api/og?slug=${encodeURIComponent(slug)}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildAuthorPerson(),
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteConfig.name,
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: post.title,
            item: postUrl,
          },
        ],
      },
      {
        "@type": "Article",
        "@id": `${postUrl}#article`,
        headline: post.title,
        description: post.summary,
        datePublished: post.date,
        dateModified: post.date,
        url: postUrl,
        image: [imageUrl],
        inLanguage: siteConfig.language,
        author: {
          "@id": personId,
        },
        publisher: {
          "@id": personId,
        },
        isPartOf: {
          "@id": websiteId,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
        breadcrumb: {
          "@id": `${postUrl}#breadcrumb`,
        },
        wordCount: post.wordCount,
        keywords: post.tags?.join(", "),
      },
    ],
  };
}
