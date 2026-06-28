import type { MetadataRoute } from "next";

const SITE_URL = "https://lunapath.dev"; // TODO: 替换为实际域名

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
