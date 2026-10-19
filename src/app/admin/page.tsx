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
import PageShell from "@/components/layout/PageShell";
import { getSidebarData } from "@/lib/content/sidebar";
import { getAdminDashboardData, type AdminStatusItem } from "@/lib/admin/stats";

// 强制每次请求动态渲染，确保统计数据实时
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "Xingye Blog 的私有只读运营面板",
  robots: {
    index: false,
    follow: false,
  },
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="entry-card">
      <p className="entry-card__desc">{label}</p>
      <p className="stat-value">{value}</p>
      {hint ? <p className="stat-hint">{hint}</p> : null}
    </div>
  );
}

function StatusList({ items }: { items: AdminStatusItem[] }) {
  return (
    <div className="kv-list">
      {items.map((item) => (
        <div key={item.label} className="kv-row">
          <span>{item.label}</span>
          <span className={item.configured ? "kv-row__ok" : "kv-row__warn"}>
            {item.detail}
          </span>
        </div>
      ))}
    </div>
  );
}

function ServiceCard({
  title,
  items,
  links,
}: {
  title: string;
  items: AdminStatusItem[];
  links: { label: string; href: string }[];
}) {
  return (
    <section className="entry-card">
      <h2 className="entry-card__title">{title}</h2>
      <StatusList items={items} />
      <div className="entry-card__links">
        {links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label} ↗
          </a>
        ))}
      </div>
    </section>
  );
}

export default function AdminPage() {
  const data = getAdminDashboardData();
  const { tags, popularPosts } = getSidebarData();

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base content-card">
        <h1 className="page-title">运营管理面板</h1>
        <p className="page-lead">
          只读查看站点内容、表单服务和部署状态。这里不会展示 API Key、完整私密邮箱列表或联系表单记录。
        </p>

        <div className="card-grid" style={{ marginTop: "1.5rem" }}>
          <StatCard
            label="全部文章"
            value={data.content.totalPosts}
            hint="包含草稿和定时发布"
          />
          <StatCard label="已发布" value={data.content.publishedPosts} />
          <StatCard label="草稿" value={data.content.draftPosts} />
          <StatCard label="定时发布" value={data.content.scheduledPosts} />
          <StatCard label="标签" value={data.content.tagCount} />
          <StatCard label="系列" value={data.content.seriesCount} />
          <StatCard
            label="热门配置"
            value={data.content.popularPosts.length}
            hint={
              data.content.missingPopularSlugs.length
                ? `${data.content.missingPopularSlugs.length} 个 slug 未匹配`
                : "配置正常"
            }
          />
          <StatCard
            label="生成时间"
            value={new Date(data.generatedAt).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            hint="服务端实时生成"
          />
        </div>
      </div>

      <div className="card-base content-card">
        <h2 className="section-title" style={{ marginLeft: 0 }}>
          服务状态
        </h2>
        <div className="card-grid">
          <ServiceCard {...data.services.subscribe} />
          <ServiceCard {...data.services.contact} />
          <ServiceCard {...data.services.analytics} />
        </div>
      </div>

      <div className="card-base content-card">
        <div className="card-grid">
          <section className="entry-card">
            <h2 className="entry-card__title">最近文章</h2>
            <div className="kv-list">
              {data.content.recentPosts.map((post) => (
                <div key={post.slug} className="kv-row">
                  <span>
                    <Link href={`/posts/${post.slug}`} className="kv-title">
                      {post.title}
                    </Link>
                    <span className="stat-hint" style={{ display: "block" }}>
                      {post.date}
                    </span>
                  </span>
                  <span className="tag-chip">{post.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="entry-card">
            <h2 className="entry-card__title">部署与检查</h2>
            <div className="kv-list">
              <div className="kv-row">
                <span>站点 URL</span>
                <span className="kv-row__value">{data.deploy.siteUrl}</span>
              </div>
              <div className="kv-row">
                <span>环境</span>
                <span className="kv-row__value">{data.deploy.vercelEnv}</span>
              </div>
              <div className="kv-row">
                <span>分支 / Commit</span>
                <span className="kv-row__value">
                  {data.deploy.commitRef} · {data.deploy.commitSha}
                </span>
              </div>
            </div>
            <p className="stat-hint" style={{ marginTop: "0.75rem" }}>
              内容检查已接入 CI；新增文章后先运行 npm run check:content，再运行完整检查。
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
