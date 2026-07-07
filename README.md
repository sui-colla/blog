# LunaPath Blog

一个基于 Next.js App Router 的个人博客框架，使用 Markdown 作为内容源，内置文章列表、标签、归档、RSS、sitemap、动态 OG 图片、站内搜索、评论、订阅和联系表单。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Markdown 内容：`gray-matter` + `remark` + `rehype-pretty-code` + `shiki`
- 搜索：`fuse.js`
- 评论：Giscus

## 本地开发

```bash
npm install
npm run dev
```

打开 <http://localhost:3000> 查看站点。

常用命令：

```bash
npm run lint       # ESLint 检查
npm run typecheck  # TypeScript 类型检查
npm run build      # 生产构建
npm run check      # lint + typecheck + build
npm run start      # 启动生产构建
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

## 内容与路由

核心文件：

- `src/lib/posts.ts`：读取 Markdown、校验 frontmatter、过滤草稿/未来文章、生成 HTML、标签、搜索索引等。
- `src/app/posts/[slug]/page.tsx`：文章详情页与文章 metadata。
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

## 部署

推荐部署到支持 Next.js 的平台（如 Vercel）。部署前请确认：

1. 设置 `NEXT_PUBLIC_SITE_URL` 为正式域名。
2. 设置 Resend 相关环境变量：`RESEND_API_KEY`、`RESEND_AUDIENCE_ID`、`FORMS_FROM_EMAIL`、`CONTACT_TO_EMAIL`。
3. 如需访问统计，设置 Umami 相关环境变量：`NEXT_PUBLIC_UMAMI_WEBSITE_ID`、`NEXT_PUBLIC_UMAMI_SCRIPT_URL`。
4. 在 Resend 中验证发件域名或使用已验证的发件地址。
5. 运行 `npm run check` 通过完整检查。
6. 上线后测试订阅表单、联系表单和 Umami 统计脚本。
