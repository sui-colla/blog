/**
 * 根布局（Root Layout）— 服务端组件
 *
 * 所有页面的公共结构：<html>、<head> 元数据、Header、Footer、全局 Provider。
 *
 * 关键设计：
 * - 字体栈由全局 CSS 提供，避免构建期依赖外部字体服务
 * - 主题（亮/暗）通过内联 <script> 在 HTML 渲染前读取 localStorage 并设置 data-theme，
 *   消除首次加载时的亮→暗闪烁（FOUC）
 * - I18nProvider 包裹 Header/main/Footer，使所有子组件可用 useI18n()
 * - DocumentTitle 在 I18nProvider 内，客户端按语言纠正标签页标题
 *   （服务端 metadata 固定中文，理由见该组件注释）
 * - Analytics 和 ServiceWorkerRegister 放在 body 末尾，不影响首屏渲染
 */
import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/layout/Analytics";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";
import DocumentTitle from "@/components/layout/DocumentTitle";
import SkipToContent from "@/components/layout/SkipToContent";
import { I18nProvider } from "@/lib/i18n";
import { siteConfig } from "@/config/site";
import { buildWebsiteJsonLd, serializeJsonLd } from "@/lib/seo/structured-data";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: siteConfig.rss.path, title: siteConfig.rss.title },
      ],
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = buildWebsiteJsonLd();

  return (
    <html
      lang={siteConfig.language}
      className="antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
        />
        {/* FOUC 防护：在浏览器渲染前同步读取 localStorage 中的主题偏好，
            直接设置 data-theme 属性，避免页面先显示亮色再跳暗色的闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col text-zinc-800 dark:text-zinc-100 font-sans">
        <I18nProvider>
          <DocumentTitle />
          <SkipToContent />
          <Header />
          <main id="main-content" className="main-content flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </I18nProvider>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
