const defaultSiteUrl = "https://lunapath.dev";
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
  themeColor: "#f97316",
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
