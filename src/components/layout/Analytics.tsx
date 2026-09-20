/**
 * Umami 访问统计脚本注入
 *
 * 使用 next/script 的 afterInteractive 策略：在页面可交互后再加载，
 * 不阻塞首屏渲染。配置缺失时不渲染任何内容。
 */
import Script from "next/script";
import { siteConfig } from "@/config/site";

export default function Analytics() {
  const { enabled, websiteId, scriptUrl } = siteConfig.analytics.umami;

  if (!enabled || !websiteId || !scriptUrl) {
    return null;
  }

  return (
    <Script
      src={scriptUrl}
      strategy="afterInteractive"
      data-website-id={websiteId}
    />
  );
}
