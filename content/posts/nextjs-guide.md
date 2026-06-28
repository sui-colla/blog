---
title: "Next.js 博客搭建指南"
date: "2026-06-20"
summary: "从零开始用 Next.js App Router 搭建一个静态博客，含 TypeScript 和 Tailwind CSS。"
tags: ["技术", "Next.js"]
---

## 为什么选 Next.js

Next.js 是目前 React 生态中最主流的全栈框架。选择它搭建博客的理由：

- **App Router**：基于文件系统的路由，零配置即用
- **静态生成 (SSG)**：`generateStaticParams` 让文章页在构建时预渲染，访问速度极快
- **内置图片优化**：`next/image` 自动懒加载、响应式裁剪、WebP 转换
- **API Routes**：表单提交、订阅等功能不需要额外后端
- **SEO 友好**：`generateMetadata` 动态生成每篇文章的 meta 标签
- **生态成熟**：Vercel 一键部署，社区插件丰富

---

## 初始化项目

```bash
npx create-next-app@latest my-blog \
  --typescript \
  --tailwind \
  --app \
  --src-dir
```

创建完成后安装博客所需的依赖：

```bash
npm install gray-matter remark remark-rehype rehype-stringify rehype-pretty-code shiki
```

| 包名 | 作用 |
|---|---|
| `gray-matter` | 解析 Markdown 文件头部的 YAML frontmatter（标题、日期、标签等） |
| `remark` | Markdown 处理引擎 |
| `remark-rehype` | 将 Markdown AST 转为 HTML AST |
| `rehype-stringify` | 将 HTML AST 序列化为字符串 |
| `rehype-pretty-code` | 基于 Shiki 的代码语法高亮 |
| `shiki` | 代码高亮引擎，支持上百种语言和主题 |

---

## 项目结构

一个典型的博客项目长这样：

```
my-blog/
├── content/
│   └── posts/                # Markdown 文章
│       ├── hello-world.md
│       └── nextjs-guide.md
├── src/
│   ├── app/
│   │   ├── layout.tsx        # 全局布局（Header + Footer）
│   │   ├── page.tsx          # 首页
│   │   ├── globals.css       # 全局样式
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # 文章详情页
│   │   ├── tags/
│   │   │   ├── page.tsx      # 标签总览
│   │   │   └── [tag]/
│   │   │       └── page.tsx  # 按标签筛选
│   │   ├── about/
│   │   │   └── page.tsx      # 关于页
│   │   ├── api/
│   │   │   ├── subscribe/
│   │   │   │   └── route.ts  # 订阅接口
│   │   │   └── og/
│   │   │       └── route.tsx # OG 图片生成
│   │   ├── feed.xml/
│   │   │   └── route.ts      # RSS 订阅源
│   │   ├── sitemap.ts        # 站点地图
│   │   └── robots.ts         # 爬虫规则
│   ├── components/           # React 组件
│   └── lib/
│       ├── posts.ts          # 文章读取与解析
│       └── i18n.tsx          # 国际化
├── public/                   # 静态资源
└── package.json
```

---

## Markdown 文章格式

每篇文章是一个带 frontmatter 的 Markdown 文件：

```markdown
---
title: "我的第一篇博客"
date: "2026-06-20"
summary: "这是一篇关于 Next.js 的入门文章。"
tags: ["技术", "Next.js"]
pinned: false
draft: false
---

## 正文标题

这里是文章内容...
```

frontmatter 字段说明：

| 字段 | 类型 | 说明 |
|---|---|---|
| `title` | string | 文章标题 |
| `date` | string | 发布日期（YYYY-MM-DD） |
| `summary` | string | 摘要，用于列表页和 SEO |
| `tags` | string[] | 标签数组 |
| `pinned` | boolean | 是否置顶 |
| `draft` | boolean | 是否草稿（不显示） |
| `publishAt` | string | 定时发布（ISO 日期） |

---

## 核心实现：文章读取与解析

`src/lib/posts.ts` 是整个博客的数据层，负责读取 Markdown、解析 frontmatter、转换 HTML。

### 读取所有文章

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fileContent = fs.readFileSync(
        path.join(postsDirectory, filename), "utf-8"
      );
      const { data, content } = matter(fileContent);

      return {
        slug,
        title: data.title,
        date: data.date,
        summary: data.summary,
        tags: data.tags,
        // 计算阅读时间...
      };
    })
    .sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}
```

### Markdown 转 HTML

使用 remark/rehype 流水线处理 Markdown，同时集成代码高亮：

```typescript
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const processed = await remark()
  .use(remarkRehype)
  .use(rehypePrettyCode, {
    theme: "one-dark-pro",  // Shiki 代码主题
    keepBackground: true,
  })
  .use(rehypeStringify)
  .process(markdownContent);

const html = processed.toString();
```

处理流程：`Markdown` → `remark AST` → `rehype AST`（含代码高亮） → `HTML 字符串`

---

## 路由与页面

### 首页

`src/app/page.tsx` 直接调用 `getAllPosts()` 获取文章列表：

```tsx
export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return <HomeContent posts={posts} tags={tags} />;
}
```

### 文章详情页

`src/app/posts/[slug]/page.tsx` 使用动态路由：

```tsx
// 告诉 Next.js 需要预渲染哪些页面
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// 动态生成每篇文章的 meta 标签
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  return <PostContent post={post} />;
}
```

`generateStaticParams` 让 Next.js 在构建时为每篇文章生成静态 HTML，访问时零延迟。

---

## 样式方案：Tailwind CSS + 自定义 CSS

项目使用 Tailwind CSS 4 做原子化样式，同时用 `globals.css` 编写复杂组件样式。

### Tailwind 配置

`postcss.config.mjs` 中启用 Tailwind：

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

在 `globals.css` 顶部引入：

```css
@import "tailwindcss";
```

### 暗色模式

Tailwind 内置 `dark:` 前缀支持暗色模式。结合自定义主题切换：

```tsx
// ThemeToggle 组件：system → light → dark 三态切换
document.documentElement.setAttribute("data-theme", "dark");
```

CSS 中同时处理系统偏好和手动切换：

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .my-class { /* 暗色样式 */ }
}
[data-theme="dark"] .my-class { /* 暗色样式 */ }
```

---

## 代码高亮

使用 `rehype-pretty-code` + `Shiki` 实现语法高亮，支持：

- 上百种编程语言
- 多种主题（本项目使用 `one-dark-pro`）
- diff 高亮（`+`/`-` 标记新增/删除行）
- 行号显示
- 语言标签自动显示

代码块的 HTML 结构：

```html
<pre data-language="typescript">
  <code>...</code>
</pre>
```

通过 CSS 伪元素自动显示语言标签：

```css
.prose pre[data-language]::before {
  content: attr(data-language);
  /* 定位和样式... */
}
```

---

## SEO 优化

### 动态 Metadata

每篇文章通过 `generateMetadata` 生成独立的 meta 标签：

```typescript
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title,
    description: post.summary,
    openGraph: { /* OG 标签 */ },
    twitter: { /* Twitter Card */ },
  };
}
```

### OG 图片动态生成

使用 Next.js 内置的 `ImageResponse` API 为每篇文章生成社交预览图：

```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    (
      <div style={{ /* 布局和样式 */ }}>
        <div>{post.title}</div>
        <div>{post.summary}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

在 `generateMetadata` 中引用：

```typescript
openGraph: {
  images: [{ url: `/api/og?slug=${slug}`, width: 1200, height: 630 }],
}
```

### JSON-LD 结构化数据

帮助搜索引擎理解文章内容：

```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  datePublished: post.date,
  author: { "@type": "Person", name: "LunaPath" },
  wordCount: post.wordCount,
};

// 在页面中注入
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

### RSS / Sitemap / Robots

- **RSS**：`src/app/feed.xml/route.ts` 生成 RSS 2.0 订阅源
- **Sitemap**：`src/app/sitemap.ts` 动态生成站点地图
- **Robots**：`src/app/robots.ts` 配置爬虫规则

---

## 搜索功能

使用 `Fuse.js` 实现客户端模糊搜索：

```typescript
import Fuse from "fuse.js";

const fuse = new Fuse(posts, {
  keys: [
    { name: "title", weight: 3 },
    { name: "summary", weight: 2 },
    { name: "tags", weight: 1.5 },
    { name: "content", weight: 1 },
  ],
  threshold: 0.4,
});

const results = fuse.search(keyword);
```

搜索索引通过 API Route `/api/search-index` 提供，前端在打开搜索框时异步加载。

---

## 评论系统

使用 [Giscus](https://giscus.app/) 基于 GitHub Discussions 的评论：

```bash
npm install @giscus/react
```

```tsx
import Giscus from "@giscus/react";

<Giscus
  repo="your-username/your-repo"
  repoId="..."
  category="Announcements"
  categoryId="..."
  mapping="pathname"
  theme="preferred_color_scheme"
/>
```

---

## 国际化 (i18n)

通过 React Context 实现中英文切换：

```typescript
const translations = {
  zh: { "nav.home": "首页", "nav.about": "关于" },
  en: { "nav.home": "Home", "nav.about": "About" },
};

function useI18n() {
  const { locale } = useContext(I18nContext);
  const t = (key: string) => translations[locale][key] ?? key;
  return { locale, t };
}
```

组件中使用：

```tsx
const { t } = useI18n();
return <h1>{t("home.greeting")}</h1>;
```

语言偏好存储在 `localStorage`，服务端渲染时默认中文避免闪烁。

---

## 交互功能

### 订阅表单

前端表单 POST 到 `/api/subscribe`，后端存储到 JSON 文件：

```typescript
// src/app/api/subscribe/route.ts
export async function POST(request: Request) {
  const { email } = await request.json();
  const subscribers = loadSubscribers();

  if (subscribers.includes(email)) {
    return NextResponse.json({ ok: false, error: "already" });
  }

  subscribers.push(email);
  fs.writeFileSync(filePath, JSON.stringify(subscribers));
  return NextResponse.json({ ok: true });
}
```

### 联系表单

同样的模式，存储到 `data/messages.json`。

---

## 部署

### Vercel（推荐）

```bash
npm run build    # 本地验证构建
npm run start    # 本地预览
```

推送到 GitHub 后，在 Vercel 导入项目即可自动部署。每次 push 触发重新构建。

### 其他平台

`npm run build` 生成 `.next/` 静态文件，可部署到任何支持 Node.js 或静态托管的平台（Netlify、Cloudflare Pages 等）。

---

## 总结

用 Next.js 搭建博客的核心流程：

1. `create-next-app` 初始化项目
2. 安装 Markdown 处理依赖（gray-matter + remark + rehype）
3. 编写 `lib/posts.ts` 数据层
4. 用 App Router 创建页面路由
5. 添加样式（Tailwind + 自定义 CSS）
6. 补充 SEO（metadata、OG、JSON-LD、RSS、sitemap）
7. 添加交互功能（搜索、订阅、评论）
8. 部署到 Vercel

完整代码参考：本博客的所有源码。
