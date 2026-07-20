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

export const siteConfig = {
  name: "LunaPath",
  description: "LunaPath 的博客，记录思考和分享知识的地方",
  englishDescription: "LunaPath's blog — notes on tech, thoughts, and life",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl),
  locale: "zh_CN",
  language: "zh-CN",
  themeColor: "#52525b",
  author: {
    name: "LunaPath",
    url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl),
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
