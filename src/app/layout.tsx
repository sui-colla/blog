import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Search from "@/components/Search";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LunaPath",
    template: "%s | LunaPath",
  },
  description: "LunaPath 的博客，记录思考和分享知识的地方",
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
    >
      <body className="min-h-screen flex flex-col bg-orange-50/30 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-orange-500 hover:text-orange-600 transition-colors"
            >
              LunaPath
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-zinc-500">
              <Link
                href="/"
                className="hover:text-orange-500 transition-colors"
              >
                首页
              </Link>
              <Link
                href="/about"
                className="hover:text-orange-500 transition-colors"
              >
                关于
              </Link>
              <Search />
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-orange-100 dark:border-zinc-800">
          <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} LunaPath &mdash; Built with Next.js
          </div>
        </footer>
      </body>
    </html>
  );
}
