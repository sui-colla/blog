---
title: "Next.js 博客搭建指南"
date: "2026-06-20"
summary: "从零开始用 Next.js App Router 搭建一个静态博客，含 TypeScript 和 Tailwind CSS。"
tags: ["技术", "Next.js"]
cover: "/images/posts/nextjs.jpg"
---

## 为什么选 Next.js

Next.js 是目前 React 生态中最主流的全栈框架。它的 App Router 提供了非常直观的文件系统路由。

## 初始化项目

```bash
npx create-next-app@latest my-blog \
  --typescript \
  --tailwind \
  --app \
  --src-dir
```

## 项目结构

一个典型的博客项目长这样：

```
my-blog/
├── content/posts/        # Markdown 文章
├── src/
│   ├── app/              # 页面路由
│   │   ├── page.tsx      # 首页
│   │   ├── layout.tsx    # 全局布局
│   │   └── posts/[slug]/ # 文章详情
│   └── lib/              # 工具函数
├── public/               # 静态资源
└── package.json
```

## 关键步骤

1. **读取 Markdown**：用 `gray-matter` 解析 frontmatter，用 `remark` 把 Markdown 转成 HTML
2. **文章列表**：`getAllPosts()` 扫描 `content/posts/` 目录，按日期排序
3. **文章详情**：`getPostBySlug()` 根据文件名查找对应文章
4. **静态生成**：`generateStaticParams()` 告诉 Next.js 预渲染哪些页面

## 部署

运行 `npm run build` 生成静态文件，部署到 Vercel 或任何静态托管服务。
