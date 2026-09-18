/**
 * 站点全局配置（Single Source of Truth）
 *
 * 所有与站点身份相关的常量都集中在这里：名称、URL、SEO 元数据、RSS、分析工具配置。
 * - 服务端和客户端均可访问（NEXT_PUBLIC_ 前缀的环境变量用于客户端）
 * - 修改站点 URL、主题色、分析配置时只需改此文件
 */
const defaultSiteUrl = "https://xiaojiccc.xyz";
const defaultUmamiScriptUrl = "https://cloud.umami.is/script.js";

/** 本地开发地址。出现在 Vercel 构建里一定是误配。 */
const localHostPattern = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i;

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, "");
}

/**
 * 解析站点 URL。
 *
 * 注意不能直接写 `process.env.X ?? defaultSiteUrl`：`??` 只在 null/undefined 时兜底，
 * 而「环境变量建出来了但值留空」是常见误配 —— 此时拿到的是空字符串，会绕过兜底，
 * 于是 canonical / OG 图 / RSS / sitemap 里的域名全部变成相对路径（metadataBase
 * 还会直接抛 Invalid URL）。所以这里把空串和纯空白一并当作未配置处理。
 *
 * 还要挡掉第二种误配：把 NEXT_PUBLIC_SITE_URL 配成本地地址。
 * 本地开发这样配是对的（见 .env.local），但它是**构建期内联**的 ——
 * 只要 Vercel 构建时也读到了这个值，线上产物的 canonical / og:url / og:image
 * 就会全部变成 http://localhost:3000。后果是搜索引擎把 localhost 当成正式地址，
 * 社交平台也抓不到 og:image（分享卡片没有图）。
 * 所以：在 Vercel 上（生产或 Preview）出现本地地址一律视为误配，回退到站点默认域名。
 */
function resolveSiteUrl(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) return normalizeSiteUrl(defaultSiteUrl);

  if (process.env.VERCEL_ENV && localHostPattern.test(trimmed)) {
    return normalizeSiteUrl(defaultSiteUrl);
  }

  return normalizeSiteUrl(trimmed);
}

const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const siteConfig = {
  name: "LunaPath",
  description: "LunaPath 的博客，记录思考和分享知识的地方",
  englishDescription: "LunaPath's blog — notes on tech, thoughts, and life",
  url: siteUrl,
  locale: "zh_CN",
  language: "zh-CN",
  themeColor: "#52525b",
  author: {
    name: "LunaPath",
    url: siteUrl,
  },
  rss: {
    path: "/feed.xml",
    title: "LunaPath RSS",
  },
  analytics: {
    umami: {
      enabled: process.env.NEXT_PUBLIC_UMAMI_ENABLED !== "false",
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() ?? "",
      scriptUrl:
        process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim() ?? defaultUmamiScriptUrl,
    },
  },
  defaultOgImage: "/api/og",
} as const;

export function absoluteUrl(path = "") {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
