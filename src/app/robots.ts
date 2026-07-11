/**
 * robots.txt 路由
 *
 * 允许所有爬虫抓取全站，但禁止 /admin（后台）和 /offline（离线页）。
 * 声明 sitemap 位置帮助搜索引擎发现所有页面。
 */
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/offline"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
