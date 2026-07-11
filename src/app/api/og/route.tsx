/**
 * Open Graph 图片生成 API（GET /api/og?slug=xxx）
 *
 * 使用 next/og 的 ImageResponse 动态生成 1200×630 的社交分享卡片：
 * - 无 slug：返回站点默认封面（品牌名 + 描述）
 * - 有 slug：渲染文章封面（标题 + 摘要 + 标签 + 日期）
 *   · 有 cover 时以封面图为背景，加半透明渐变遮罩
 *   · 无 cover 时使用渐变背景色
 *
 * runtime = "nodejs"：需要文件系统访问来读取文章内容。
 */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getPostBySlug } from "@/lib/posts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #fdf2f8, #fce7f3, #f9a8d4)",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#71717a",
              marginTop: 16,
            }}
          >
            {siteConfig.englishDescription}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const post = await getPostBySlug(slug);
  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  const hasCover = !!post.cover;
  const coverUrl = post.cover
    ? post.cover.startsWith("http")
      ? post.cover
      : absoluteUrl(post.cover)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          background: hasCover ? "#000" : "linear-gradient(135deg, #fdf2f8, #fce7f3, #f9a8d4)",
        }}
      >
        {/* 背景封面图 */}
        {hasCover && (
          <img
            src={coverUrl!}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(2px) brightness(0.4)",
            }}
          />
        )}

        {/* 渐变遮罩 */}
        {hasCover && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(249,115,22,0.85), rgba(234,88,12,0.7))",
            }}
          />
        )}

        {/* 内容区 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
            height: "100%",
            width: "100%",
          }}
        >
          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              {post.tags.slice(0, 3).map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.9)",
                    background: "rgba(255,255,255,0.2)",
                    padding: "6px 20px",
                    borderRadius: 9999,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* 标题 */}
          <div
            style={{
              display: "flex",
              fontSize: post.title.length > 40 ? 40 : 52,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
              maxWidth: "85%",
            }}
          >
            {post.title}
          </div>

          {/* 摘要 */}
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(255,255,255,0.85)",
              marginTop: 20,
              lineHeight: 1.5,
              maxWidth: "75%",
              overflow: "hidden",
            }}
          >
            {post.summary}
          </div>

          {/* 底部信息 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: "auto",
              paddingTop: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {siteConfig.name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {post.date} · {post.readingTime} min read
            </div>
          </div>
        </div>

        {/* 右上角装饰 */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.3)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
