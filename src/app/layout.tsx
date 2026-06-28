import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://lunapath.dev"; // TODO: 替换为实际域名

export const metadata: Metadata = {
  title: {
    default: "LunaPath",
    template: "%s | LunaPath",
  },
  description: "LunaPath 的博客，记录思考和分享知识的地方",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "LunaPath",
    description: "LunaPath 的博客，记录思考和分享知识的地方",
    url: SITE_URL,
    siteName: "LunaPath",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LunaPath",
    description: "LunaPath 的博客，记录思考和分享知识的地方",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title="LunaPath RSS" href="/feed.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-orange-50/30 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
