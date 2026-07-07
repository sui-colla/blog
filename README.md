# LunaPath Blog

[![CI](https://github.com/sui-colla/blog/actions/workflows/ci.yml/badge.svg)](https://github.com/sui-colla/blog/actions/workflows/ci.yml)

一个基于 Next.js App Router 的个人博客，使用 Markdown 作为内容源，内置文章列表、标签、归档、RSS、sitemap、动态 OG 图片、站内搜索、评论、订阅、联系表单、PWA 离线阅读、后台只读面板和内容型页面。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Markdown 内容：`gray-matter` + `remark` + `rehype-pretty-code` + `shiki`
- 搜索：`fuse.js`
- 评论：Giscus
- 表单服务：Resend
- 访问统计：可选 Umami

## 功能概览

- Markdown 文章、标签、系列、归档、RSS、sitemap 和 robots。
- 搜索弹窗支持快捷键、关键词高亮、正文片段、标签/系列筛选。
- 文章页支持目录、相关文章、上一篇/下一篇、分享、评论、打赏和订阅。
- 图片支持 `figure`/`figcaption`、懒加载、灯箱和键盘打开。
- 代码块支持 Shiki 高亮、文件名/语言 header、行高亮和复制状态反馈。
- `/projects`、`/now`、`/links`、`/uses` 内容型页面增强个人主页属性。
- `/admin` 私有只读后台查看内容统计、表单配置和外部服务入口。
- PWA manifest、图标、service worker 与 `/offline` 离线 fallback。
- `npm run check:content` 自动检查 frontmatter、站内链接和图片质量。

## 本地开发

```bash
npm install
npm run dev
```

打开 <http://localhost:3000> 查看站点。

常用命令：

```bash
npm run lint           # ESLint 检查
npm run typecheck      # TypeScript 类型检查
npm run check:content  # Markdown 文章内容质量检查
npm run build          # 生产构建
npm run check          # lint + typecheck + check:content + build
npm run start          # 启动生产构建
```

## 站点配置

站点名称、描述、作者、RSS 路径和域名集中在 `src/config/site.ts`。

生产环境建议设置：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

如果不设置，会回退到默认域名 `https://lunapath.dev`。这个地址会影响 metadata、canonical、RSS、sitemap、robots、分享链接和 OG 图片中的绝对 URL。

## 访问统计与热门文章

访问统计使用可选的 Umami 脚本，不配置时不会输出统计脚本：

```bash
NEXT_PUBLIC_UMAMI_ENABLED=true
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-website-id
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
```

这些变量会进入浏览器端 HTML，只能放 Umami website id 和脚本地址，不能放 API token 或其他密钥。

热门文章第一版使用静态配置维护，配置文件是 `src/config/popular-posts.ts`。上线后可以根据 Umami 后台的访问数据调整 slug 顺序。

## 新增文章

在 `content/posts` 下新增一个 `.md` 文件，文件名就是文章 slug，例如：

```text
content/posts/my-new-post.md
```

文章 frontmatter 示例：

```md
---
title: "文章标题"
date: "2026-07-07"
summary: "文章摘要，会用于列表、SEO 和 RSS。"
tags: ["技术", "Next.js"]
cover: "/images/cover.jpg"
pinned: false
draft: false
publishAt: "2026-07-07T08:00:00+08:00"
series: "Next.js 实战"
---

正文内容...
```

文章图片可以使用 Markdown title 作为可见说明；没有 title 时会使用 alt 作为 caption：

```md
![图片替代文本](/images/example.jpg "图片说明")
```

代码块支持文件名和行高亮 meta：

````md
```ts title="src/app/page.tsx" {1,3-5}
export default function Page() {
  return null;
}
```
````

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期，需是可解析日期字符串 |
| `summary` | 是 | 摘要，用于列表、SEO、RSS 和搜索 |
| `tags` | 否 | 标签数组 |
| `cover` | 否 | 封面图路径，可用于 OG 图片 |
| `pinned` | 否 | 是否置顶，置顶文章会排在前面 |
| `draft` | 否 | `true` 时不会出现在首页、标签、归档、RSS、sitemap、搜索，也不能直接访问 |
| `publishAt` | 否 | 未来时间不会发布；静态部署需要重新构建后才会出现 |
| `series` | 否 | 系列/专栏名称，相同系列会生成系列导航 |

### 内容质量检查

新增或修改文章后，建议先运行：

```bash
npm run check:content
```

检查内容包括：

- `title`、`date`、`summary` 等必填 frontmatter。
- `date`、`publishAt` 日期格式。
- `tags`、`series` 命名是否为空、重复或存在首尾空格。
- 文章内站内链接、相对链接和本地图片路径是否存在。
- Markdown 图片是否填写 alt 文本；图片体积过大时会给出压缩建议。

本地图片建议放在 `public/images` 下，并使用 `/images/xxx.jpg` 这样的路径引用。默认检查不会访问外网，避免 CI 因网络波动失败；如需检查外链可用性，可手动运行：

```bash
npm run check:content -- --external
```

## 内容与路由

核心文件：

- `src/lib/posts.ts`：读取 Markdown、校验 frontmatter、过滤草稿/未来文章、生成 HTML、标签、搜索索引等。
- `src/lib/rehype-figures.ts`：把独立 Markdown 图片渲染为 `figure` + `figcaption`。
- `src/lib/rehype-code-meta.ts`：为代码块生成文件名、语言和复制按钮动作区。
- `src/config/content-pages.ts`：维护 `/projects`、`/now`、`/links`、`/uses` 的静态内容数据。
- `src/app/posts/[slug]/page.tsx`：文章详情页与文章 metadata。
- `src/app/projects/page.tsx`、`src/app/now/page.tsx`、`src/app/links/page.tsx`、`src/app/uses/page.tsx`：内容型页面。
- `src/app/sitemap.ts`：动态 sitemap。
- `src/app/robots.ts`：robots.txt。
- `src/app/feed.xml/route.ts`：RSS 输出。
- `src/app/api/search-index/route.ts`：站内搜索索引。
- `src/app/api/og/route.tsx`：动态 Open Graph 图片。

## 搜索、RSS 与 SEO

文章数据层会统一过滤未发布内容：

- `draft: true` 的草稿不会公开。
- `publishAt` 晚于当前时间的文章不会公开。
- 首页、标签、归档、RSS、sitemap、搜索索引和直接访问 slug 都复用同一套发布规则。

RSS、sitemap、robots 和页面 metadata 都使用 `src/config/site.ts` 里的统一配置，减少域名或站点名称不一致的问题。

## 生产环境注意事项

订阅和联系表单通过 Resend 在服务端处理，不再依赖运行时本地 JSON 写入：

- `src/app/api/subscribe/route.ts`：把邮箱加入 Resend Audience。
- `src/app/api/contact/route.ts`：把联系表单内容发送到站长邮箱。

需要在本地 `.env.local` 或部署平台环境变量中配置：

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxxxxxxxxxxxxxx
FORMS_FROM_EMAIL="LunaPath Blog <onboarding@resend.dev>"
CONTACT_TO_EMAIL=you@example.com
# 可选：限制表单提交来源，多个来源用英文逗号分隔
FORM_ALLOWED_ORIGINS=https://your-domain.com
```

可以参考 `.env.example`。注意：Resend 密钥和邮箱配置不要使用 `NEXT_PUBLIC_` 前缀，避免暴露到浏览器端。

Giscus 评论需要在 `src/components/Comments.tsx` 中配置真实的 `repoId` 和 `categoryId`。

## 后台管理页

`/admin` 是私有只读运营面板，用于查看文章统计、Resend/联系表单配置状态、Umami 状态和部署信息。它不会出现在公开导航或 sitemap 中，也不会展示 API Key、完整私密邮箱列表或联系表单记录。

需要配置 Basic Auth 环境变量：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
# 可选：后台显示的 Umami 快捷入口
UMAMI_DASHBOARD_URL=https://cloud.umami.is
```

如果 `ADMIN_USERNAME` 或 `ADMIN_PASSWORD` 缺失，`/admin` 会 fail closed，不渲染管理面板。

## PWA 与离线阅读

站点包含 Web App Manifest、PWA 图标、离线 fallback 页面和生产环境 service worker。生产构建中，浏览器会注册 `/sw.js` 并缓存基础资源、搜索索引和访问过的公开页面。

缓存策略保持保守：

- `/admin`、`/admin/*` 永远不缓存。
- `/api/subscribe`、`/api/contact` 和非 GET 请求不缓存。
- 公开页面使用 network-first，断网时回退到已缓存页面或 `/offline`。
- `/_next/static/*` 使用 cache-first；`/api/search-index` 使用 stale-while-revalidate。

本地验证 PWA 行为时，请使用生产模式：

```bash
npm run build
npm run start
```

然后在浏览器 DevTools 的 Application 面板检查 manifest、icons、service worker 和离线状态。

## GitHub 工作流

仓库包含基础 GitHub 配置：

- `.github/workflows/ci.yml`：在 PR 和 `main` push 时运行 `npm run check`。
- `.github/PULL_REQUEST_TEMPLATE.md`：PR 描述和验证清单。
- `.github/ISSUE_TEMPLATE/content-task.md`：文章、页面和链接维护任务模板。
- `.github/ISSUE_TEMPLATE/bug-report.md`：站点、构建或内容渲染问题模板。

推荐流程：从功能分支提交 → 开 PR → 等 CI 通过 → 合并到 `main`。

## 部署

推荐部署到支持 Next.js 的平台（如 Vercel）。部署前请确认：

1. 设置 `NEXT_PUBLIC_SITE_URL` 为正式域名。
2. 设置 Resend 相关环境变量：`RESEND_API_KEY`、`RESEND_AUDIENCE_ID`、`FORMS_FROM_EMAIL`、`CONTACT_TO_EMAIL`。
3. 如需访问统计，设置 Umami 相关环境变量：`NEXT_PUBLIC_UMAMI_WEBSITE_ID`、`NEXT_PUBLIC_UMAMI_SCRIPT_URL`。
4. 在 Resend 中验证发件域名或使用已验证的发件地址。
5. 运行 `npm run check` 通过完整检查。
6. 上线后测试订阅表单、联系表单和 Umami 统计脚本。
