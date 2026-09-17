/**
 * 站点全局配置（Single Source of Truth）
 *
 * 所有与站点身份相关的常量都集中在这里：名称、URL、SEO 元数据、RSS、分析工具配置。
 * - 服务端和客户端均可访问（NEXT_PUBLIC_ 前缀的环境变量用于客户端）
 * - 修改站点 URL、主题色、分析配置时只需改此文件
 */
const defaultSiteUrl = "https://xiaojiccc.xyz";
const defaultUmamiScriptUrl = "https://cloud.umami.is/script.js";

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
 */
function resolveSiteUrl(raw: string | undefined): string {
  const trimmed = raw?.trim();
  return normalizeSiteUrl(trimmed ? trimmed : defaultSiteUrl);
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
