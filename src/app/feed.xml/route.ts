import { getAllPosts, getPostBySlug } from "@/lib/posts";

const SITE_URL = "https://lunapath.dev"; // TODO: 替换为实际域名
const SITE_NAME = "LunaPath";
const SITE_DESCRIPTION = "LunaPath 的博客，记录思考和分享知识的地方";

export async function GET() {
  const posts = getAllPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const full = await getPostBySlug(post.slug);
      const content = full?.contentHtml ?? post.summary;

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
${
  post.tags
    ? post.tags.map((tag) => `      <category>${tag}</category>`).join("\n")
    : ""
}
    </item>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
