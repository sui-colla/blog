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
