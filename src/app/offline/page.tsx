import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "离线阅读",
  description: "当前网络不可用，可以继续阅读已缓存的 LunaPath 内容。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center px-6 py-16 text-center sm:py-24">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-500">Offline</p>
      <h1 className="mt-4 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
        现在处于离线状态
      </h1>
      <p className="mt-5 text-zinc-600 dark:text-zinc-400">
        网络连接不可用。你仍然可以打开之前访问过并已缓存的文章；如果这是第一次访问该页面，请恢复网络后重试。
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
        >
          返回首页
        </Link>
        <a
          href="."
          className="rounded-full border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 dark:border-orange-900/70 dark:text-orange-300 dark:hover:bg-orange-950/40"
        >
          重新加载
        </a>
      </div>
    </div>
  );
}
