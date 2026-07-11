/**
 * 搜索索引 API（GET /api/search-index）
 *
 * 返回所有已发布文章的搜索数据（JSON），供客户端 Fuse.js 消费。
 * - force-static: 构建时生成一次
 * - CDN 缓存 24h，浏览器缓存 1h
 * - 草稿和未来发布的文章不包含在索引中
 */
import { getSearchIndexItems } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(getSearchIndexItems(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
