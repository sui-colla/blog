/**
 * RSS Feed 路由（/feed.xml）
 *
 * 生成标准 RSS 2.0 XML，包含全文内容（content:encoded）。
 * force-static: 构建时生成一次，CDN 缓存 24 小时（s-maxage=86400）。
 */
import { absoluteUrl, siteConfig } from "@/config/site";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 包裹 CDATA 段，同时处理内容中可能出现的 `]]>` 截断（拆分为两段 CDATA）
function cdata(value: string) {
  return `<![CDATA[${value.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

function latestPostDate(posts: { date: string }[]) {
  const latest = posts.reduce((current, post) => {
    const time = new Date(post.date).getTime();
    return time > current ? time : current;
  }, 0);

  return latest > 0 ? new Date(latest) : new Date(0);
}

export async function GET() {
  const posts = getAllPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const full = await getPostBySlug(post.slug);
      const content = full?.contentHtml ?? post.summary;
      const postUrl = absoluteUrl(`/posts/${post.slug}`);

      return `    <item>
      <title>${cdata(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${cdata(post.summary)}</description>
      <content:encoded>${cdata(content)}</content:encoded>
${post.tags ? post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n") : ""}
    </item>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>${escapeXml(siteConfig.language)}</language>
    <lastBuildDate>${latestPostDate(posts).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl(siteConfig.rss.path))}" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
