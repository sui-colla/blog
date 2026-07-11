/**
 * 管理后台页面（/admin）
 *
 * 只读运营面板，展示文章统计、服务配置状态和部署信息。
 * - force-dynamic: 每次请求都重新生成，不缓存
 * - 访问保护：通过 middleware（proxy.ts）的 Basic Auth 拦截未授权请求
 * - robots: noindex/nofollow，防止搜索引擎收录
 */
import type { Metadata } from "next";
import Link from "next/link";
import { getAdminDashboardData, type AdminStatusItem } from "@/lib/admin/stats";

// 强制每次请求动态渲染，确保统计数据实时
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "LunaPath Blog 的私有只读运营面板",
  robots: {
    index: false,
    follow: false,
  },
};

function StatusPill({ ready }: { ready: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        ready
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
      }`}
    >
      {ready ? "Ready" : "Needs setup"}
    </span>
  );
}

function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-3xl border border-orange-100/80 bg-white/80 p-5 shadow-sm shadow-orange-100/40 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
      {hint ? <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p> : null}
    </div>
  );
}

function StatusList({ items }: { items: AdminStatusItem[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-start justify-between gap-4 rounded-2xl bg-orange-50/70 px-4 py-3 text-sm dark:bg-zinc-950/70">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">{item.label}</span>
          <span className={item.configured ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>
            {item.detail}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ServiceCard({
  title,
  ready,
  items,
  links,
}: {
  title: string;
  ready: boolean;
  items: AdminStatusItem[];
  links: { label: string; href: string }[];
}) {
  return (
    <section className="rounded-3xl border border-orange-100/80 bg-white/80 p-6 shadow-sm shadow-orange-100/40 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <StatusPill ready={ready} />
      </div>
      <StatusList items={items} />
      <div className="mt-5 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-orange-200 px-3 py-1.5 text-sm font-medium text-orange-700 transition hover:bg-orange-50 dark:border-orange-900/70 dark:text-orange-300 dark:hover:bg-orange-950/40"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

export default function AdminPage() {
  const data = getAdminDashboardData();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange-500">Private dashboard</p>
        <h1 className="mt-3 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          运营管理面板
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          只读查看站点内容、表单服务和部署状态。这里不会展示 API Key、完整私密邮箱列表或联系表单记录。
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="全部文章" value={data.content.totalPosts} hint="包含草稿和定时发布" />
        <StatCard label="已发布" value={data.content.publishedPosts} />
        <StatCard label="草稿" value={data.content.draftPosts} />
        <StatCard label="定时发布" value={data.content.scheduledPosts} />
        <StatCard label="标签" value={data.content.tagCount} />
        <StatCard label="系列" value={data.content.seriesCount} />
        <StatCard label="热门配置" value={data.content.popularPosts.length} hint={data.content.missingPopularSlugs.length ? `${data.content.missingPopularSlugs.length} 个 slug 未匹配` : "配置正常"} />
        <StatCard label="生成时间" value={new Date(data.generatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })} hint="服务端实时生成" />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <ServiceCard {...data.services.subscribe} />
        <ServiceCard {...data.services.contact} />
        <ServiceCard {...data.services.analytics} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-orange-100/80 bg-white/80 p-6 shadow-sm shadow-orange-100/40 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">最近文章</h2>
          <div className="mt-4 space-y-3">
            {data.content.recentPosts.map((post) => (
              <div key={post.slug} className="flex items-center justify-between gap-4 rounded-2xl bg-orange-50/70 px-4 py-3 dark:bg-zinc-950/70">
                <div>
                  <Link href={`/posts/${post.slug}`} className="font-medium text-zinc-800 hover:text-orange-600 dark:text-zinc-100 dark:hover:text-orange-300">
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{post.date}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-orange-100/80 bg-white/80 p-6 shadow-sm shadow-orange-100/40 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">部署与检查</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">站点 URL</dt>
              <dd className="mt-1 break-all font-medium text-zinc-800 dark:text-zinc-100">{data.deploy.siteUrl}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">环境</dt>
              <dd className="mt-1 font-medium text-zinc-800 dark:text-zinc-100">{data.deploy.vercelEnv}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">分支 / Commit</dt>
              <dd className="mt-1 font-medium text-zinc-800 dark:text-zinc-100">{data.deploy.commitRef} · {data.deploy.commitSha}</dd>
            </div>
          </dl>
          <div className="mt-5 rounded-2xl bg-zinc-950 px-4 py-3 font-mono text-xs text-orange-100">
            npm run check:content
          </div>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            内容检查已接入 CI；新增文章后先运行上面的命令，再运行完整检查。
          </p>
        </section>
      </div>
    </div>
  );
}
