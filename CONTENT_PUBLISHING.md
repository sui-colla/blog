# 博客内容创作与发布流程

本文件是 `xiaojiccc.xyz` 的内容维护手册。以后创建文章、修改内容、预览、发布或回滚时，都以本文件为准。

## 可以直接对 Codex 说

- “写一篇关于 PLC 变频器的文章，先预览，不发布。”
- “修改 `plc-learning-roadmap`，补充一个案例，先检查。”
- “检查刚写的文章并发布到正式网站。”
- “把关于页更新为以下内容，但先不要上线。”
- “回滚刚才发布的文章。”

Codex 收到这些请求时，应先读取本文件，再执行对应流程。

## 内容位置

| 内容 | 文件位置 |
| --- | --- |
| 博客文章 | `content/posts/*.md` |
| 文章图片 | `public/images/posts/<slug>/` |
| 关于、项目、近况、链接、设备页 | `src/config/content-pages.ts` |
| 网站名称、域名和基础信息 | `src/config/site.ts` |
| 热门文章排序 | `src/config/popular-posts.ts` |
| 环境变量示例 | `.env.example` |
| 本地私密环境变量 | `.env.local`，禁止提交 |

## 分支规则

- `main` 是唯一长期分支，也是正式发布分支。
- 每次内容更新都从最新 `main` 创建临时分支。
- 文章使用 `post-topic`，修复使用 `fix-topic`，功能使用 `feat-topic`。
- 名称使用小写英文和连字符，保持简短，例如 `post-plc-drive`、`fix-email`。
- 临时分支合并后立即删除，不长期复用。

开始创作：

```powershell
git switch main
git pull --ff-only origin main
git switch -c post-plc-drive
```

如果工作区已有未提交内容，先确认这些内容的归属，禁止覆盖或丢弃用户修改。

## 新建文章

文章文件名就是网址 slug：

```text
content/posts/plc-variable-frequency-drive.md
```

基础模板：

```markdown
---
title: "文章标题"
date: "YYYY-MM-DD"
summary: "用于首页、搜索、RSS 和 SEO 的简洁摘要。"
tags: ["PLC", "自动化"]
pinned: false
draft: false
series: "PLC 学习笔记"
---

## 正文标题

正文内容……
```

可选字段：

| 字段 | 用途 |
| --- | --- |
| `cover` | 封面图路径，例如 `/images/posts/slug/cover.webp` |
| `pinned` | `true` 时在文章列表置顶 |
| `draft` | `true` 时首页、搜索、RSS 和直接访问都会隐藏 |
| `publishAt` | 指定未来发布时间，但到时仍需触发一次 Vercel 构建 |
| `series` | 相同名称的文章会组成系列导航 |

注意：`draft: true` 在本地也无法直接预览。需要审阅效果时，推荐在临时分支保持 `draft: false`，只使用本地预览或 Vercel Preview，不合并到 `main`。

## 图片

建议按文章单独建目录：

```text
public/images/posts/plc-variable-frequency-drive/
```

Markdown 引用：

```markdown
![变频器接线示意图](/images/posts/plc-variable-frequency-drive/wiring.webp "变频器接线示意图")
```

- 图片必须填写有意义的 alt 文本。
- 优先使用 WebP、AVIF 或经过压缩的 JPEG/PNG。
- 单张图片尽量控制在 500KB 以下。
- 不要引用本机绝对路径。

## 本地预览与检查

启动开发服务器：

```powershell
npm run dev
```

默认访问 `http://localhost:3000`。如果端口被占用，使用终端实际显示的地址。

内容检查：

```powershell
npm run check:content
```

正式发布前完整检查：

```powershell
npm run check
```

`npm run check` 会执行 ESLint、TypeScript、内容检查和生产构建。任何一步失败都不能发布。

## 预览但不发布

完成内容和检查后，将临时分支推送到 GitHub：

```powershell
git add content/posts
# 文章新增了图片时，再添加对应图片目录
git add public/images/posts/plc-variable-frequency-drive
git commit -m "content: add 文章标题"
git push -u origin post-plc-drive
```

Vercel 会为非 `main` 分支生成 Preview Deployment。检查以下内容：

- 桌面端和移动端排版。
- 标题、摘要、标签、目录和代码块。
- 图片、站内链接和外链。
- 深色模式。
- Vercel 与 GitHub 检查全部通过。

预览分支可能拥有公开链接，但不会替换正式域名。

## 正式发布

只有用户明确说“发布”“上线”或“合并到 main”时，才执行正式发布。

1. 确认 `npm run check` 通过。
2. 确认 Vercel Preview 正常。
3. 创建 Pull Request，目标分支为 `main`。
4. 合并 Pull Request。
5. 等待 Vercel Production Deployment 完成。
6. 打开 `https://xiaojiccc.xyz` 检查文章。
7. 确认首页、文章页、标签、搜索、RSS 和 sitemap 已更新。
8. 删除 GitHub 和本地临时分支。

合并后的本地清理：

```powershell
git switch main
git pull --ff-only origin main
git branch -d post-plc-drive
```

如果 GitHub 没有自动删除远程分支：

```powershell
git push origin --delete post-plc-drive
```

如果 Pull Request 使用 squash 或 rebase 合并，Git 可能无法根据提交祖先关系判断分支已经合并。确认 GitHub PR 已合并且内容已在 `main` 后，才可以将最后一条本地清理命令改为 `git branch -D post-plc-drive`。

## 定时发布

`publishAt` 只负责在构建时过滤未来文章，不会在指定时间自动唤醒 Vercel。

推荐做法：

1. 提前在临时分支完成文章和预览。
2. 到发布时间再合并到 `main`。

如果提前合并带 `publishAt` 的文章，必须在发布时间之后手动 Redeploy，或另行配置定时构建。

## 修改已有内容

- 修改文章：编辑对应的 `content/posts/<slug>.md`。
- 尽量不要修改已经公开的 slug，否则旧链接会失效。
- 如必须修改 slug，应同时处理跳转、站内链接和搜索引擎影响。
- 修改正文后仍需走临时分支、预览、检查和 Pull Request 流程。
- 修改代码、样式或配置时，必须运行完整的 `npm run check`。

## 环境变量与敏感信息

- 密钥只放在本地 `.env.local` 或 Vercel Environment Variables。
- 禁止把 API Key、密码、邮箱列表或令牌写入 Markdown、源码和 Git 提交。
- 修改 Vercel 环境变量后，需要重新部署才会生效。
- 正式域名相关变量应使用 `https://xiaojiccc.xyz`。

## 回滚

优先使用 Git 回滚，保证 GitHub 与 Vercel 的源码状态一致：

1. 找到引入问题的提交或合并提交。
2. 使用 `git revert` 创建反向提交，不重写 `main` 历史。
3. 推送到 `main`，让 Vercel 重新部署。
4. 检查正式域名恢复正常。

紧急情况下可以先在 Vercel 恢复上一个成功部署，但随后仍应在 Git 中完成对应回滚，避免下次部署重新带回问题。

## Codex 执行约定

- 收到内容相关请求时，先读取本文件并检查当前 Git 状态。
- “创作”“修改”“预览”默认不允许合并到 `main`。
- 只有明确收到发布授权后，才允许合并、推送生产分支或触发正式部署。
- 发布前报告修改文件、检查结果、Preview 状态和将要合并的分支。
- 发布后报告正式提交、Vercel 状态、线上检查结果和分支清理结果。
- 始终保留用户已有修改，禁止使用破坏性 Git 命令覆盖工作区。
