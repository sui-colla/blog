/**
 * Admin 仪表盘数据聚合（仅服务端）
 *
 * server-only 确保此模块不会被客户端代码引用，防止敏感逻辑泄露。
 * 聚合内容统计（文章/草稿/标签/系列）和服务配置状态（Resend/Umami/Vercel），
 * 供 /admin 页面只读展示。不暴露 API Key 或完整邮箱列表。
 */
import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { popularPostSlugs } from "@/config/popular-posts";
import { siteConfig } from "@/config/site";

const postsDirectory = path.join(process.cwd(), "content", "posts");

interface AdminPostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
  publishAt?: string;
  series?: string;
}

export interface AdminStatusItem {
  label: string;
  configured: boolean;
  detail: string;
}

function envValue(name: string) {
  return process.env[name]?.trim() ?? "";
}

function isConfigured(name: string) {
  return envValue(name).length > 0;
}

function maskEmail(value: string) {
  const [localPart, domain] = value.split("@");
  if (!localPart || !domain) return value ? "已配置" : "未配置";

  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}${"*".repeat(Math.max(3, localPart.length - visible.length))}@${domain}`;
}

function parseDate(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function readAllPostMetas(): AdminPostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .sort()
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const { data } = matter(fs.readFileSync(fullPath, "utf-8"));

      return {
        slug,
        title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : slug,
        date: typeof data.date === "string" ? data.date : "",
        tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === "string") : [],
        draft: data.draft === true,
        publishAt: typeof data.publishAt === "string" ? data.publishAt : undefined,
        series: typeof data.series === "string" && data.series.trim() ? data.series.trim() : undefined,
      };
    });
}

function isScheduled(post: Pick<AdminPostMeta, "draft" | "publishAt">, now: Date) {
  if (post.draft || !post.publishAt) return false;
  return new Date(post.publishAt) > now;
}

function isPublished(post: Pick<AdminPostMeta, "draft" | "publishAt">, now: Date) {
  if (post.draft) return false;
  if (post.publishAt && new Date(post.publishAt) > now) return false;
  return true;
}

function configuredItem(label: string, envName: string, detailWhenConfigured = "已配置") {
  const configured = isConfigured(envName);
  return {
    label,
    configured,
    detail: configured ? detailWhenConfigured : `缺少 ${envName}`,
  } satisfies AdminStatusItem;
}

export function getAdminDashboardData() {
  const now = new Date();
  const posts = readAllPostMetas();
  const publishedPosts = posts.filter((post) => isPublished(post, now));
  const draftPosts = posts.filter((post) => post.draft);
  const scheduledPosts = posts.filter((post) => isScheduled(post, now));
  const tagNames = new Set(posts.flatMap((post) => post.tags.map((tag) => tag.trim()).filter(Boolean)));
  const seriesNames = new Set(posts.map((post) => post.series).filter((series): series is string => Boolean(series)));
  const postMap = new Map(posts.map((post) => [post.slug, post]));
  const configuredPopularPosts = popularPostSlugs.map((slug) => postMap.get(slug)).filter(Boolean) as AdminPostMeta[];
  const missingPopularSlugs = popularPostSlugs.filter((slug) => !postMap.has(slug));
  const contactToEmail = envValue("CONTACT_TO_EMAIL");
  const umamiEnabled = siteConfig.analytics.umami.enabled;
  const umamiWebsiteId = siteConfig.analytics.umami.websiteId;
  const resendAudienceId = envValue("RESEND_AUDIENCE_ID");
  const umamiDashboardUrl = envValue("UMAMI_DASHBOARD_URL");

  return {
    generatedAt: now.toISOString(),
    content: {
      totalPosts: posts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: draftPosts.length,
      scheduledPosts: scheduledPosts.length,
      tagCount: tagNames.size,
      seriesCount: seriesNames.size,
      recentPosts: [...posts]
        .sort((a, b) => parseDate(b.date) - parseDate(a.date))
        .slice(0, 5)
        .map((post) => ({
          slug: post.slug,
          title: post.title,
          date: post.date,
          status: post.draft ? "草稿" : isScheduled(post, now) ? "定时" : "已发布",
        })),
      popularPosts: configuredPopularPosts.map((post) => ({
        slug: post.slug,
        title: post.title,
      })),
      missingPopularSlugs,
    },
    services: {
      subscribe: {
        title: "订阅表单",
        ready: isConfigured("RESEND_API_KEY") && isConfigured("RESEND_AUDIENCE_ID"),
        items: [
          configuredItem("Resend API Key", "RESEND_API_KEY"),
          configuredItem("Audience ID", "RESEND_AUDIENCE_ID"),
        ],
        links: [
          { label: "Resend Audiences", href: "https://resend.com/audiences" },
          ...(resendAudienceId ? [{ label: "当前 Audience", href: `https://resend.com/audiences/${encodeURIComponent(resendAudienceId)}` }] : []),
        ],
      },
      contact: {
        title: "联系表单",
        ready: isConfigured("RESEND_API_KEY") && isConfigured("FORMS_FROM_EMAIL") && isConfigured("CONTACT_TO_EMAIL"),
        items: [
          configuredItem("Resend API Key", "RESEND_API_KEY"),
          configuredItem("发件邮箱", "FORMS_FROM_EMAIL"),
          configuredItem("收件邮箱", "CONTACT_TO_EMAIL", contactToEmail ? maskEmail(contactToEmail) : "已配置"),
        ],
        links: [{ label: "Resend Email Logs", href: "https://resend.com/emails" }],
      },
      analytics: {
        title: "访问统计",
        ready: umamiEnabled && Boolean(umamiWebsiteId),
        items: [
          {
            label: "Umami 脚本",
            configured: umamiEnabled,
            detail: umamiEnabled ? "已启用" : "NEXT_PUBLIC_UMAMI_ENABLED=false",
          },
          {
            label: "Website ID",
            configured: Boolean(umamiWebsiteId),
            detail: umamiWebsiteId ? "已配置" : "缺少 NEXT_PUBLIC_UMAMI_WEBSITE_ID",
          },
          {
            label: "Script URL",
            configured: Boolean(siteConfig.analytics.umami.scriptUrl),
            detail: siteConfig.analytics.umami.scriptUrl,
          },
        ],
        links: [
          ...(umamiDashboardUrl ? [{ label: "Umami Dashboard", href: umamiDashboardUrl }] : []),
          { label: "Umami Cloud", href: "https://cloud.umami.is" },
        ],
      },
    },
    deploy: {
      siteUrl: siteConfig.url,
      vercelEnv: envValue("VERCEL_ENV") || "本地 / 未配置",
      commitRef: envValue("VERCEL_GIT_COMMIT_REF") || "未配置",
      commitSha: envValue("VERCEL_GIT_COMMIT_SHA")
        ? `${envValue("VERCEL_GIT_COMMIT_SHA").slice(0, 7)}…`
        : "未配置",
    },
  };
}
