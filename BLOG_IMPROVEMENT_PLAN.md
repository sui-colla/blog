# 博客功能改进计划

这个文档用来记录博客后续功能计划。每完成一个功能，就把对应任务打勾，并在备注里记录完成时间和验证方式。

## 总览清单

- [x] 订阅/联系表单生产化
- [x] 访问统计与热门文章
- [x] 搜索体验增强
- [x] SEO 结构化数据增强
- [x] 后台管理页
- [x] PWA / 离线阅读
- [x] 内容型页面：projects / now / links / uses
- [x] 图片与代码块体验增强
- [x] 自动内容质量检查与 CI

## 1. 订阅/联系表单生产化

目标：移除运行时本地 JSON 写入，让订阅和联系表单适合部署到 Vercel/serverless 等生产环境。

- [x] 使用 Resend 作为表单后端
- [x] 订阅表单写入 Resend Audience
- [x] 联系表单通过 Resend 发送到站长邮箱
- [x] 服务端统一字段校验、长度限制和错误码
- [x] 前端通过 i18n 显示成功/失败文案
- [x] 添加 `.env.example` 和 README 配置说明
- [x] 通过 lint、typecheck、build/check 验证

## 2. 访问统计与热门文章

目标：了解文章访问情况，并在首页或侧边栏展示热门内容。

- [x] 选择统计方案（Umami / Plausible / Vercel Analytics 等）
- [x] 接入基础访问统计
- [x] 设计热门文章数据来源
- [x] 展示热门文章模块

## 3. 搜索体验增强

目标：让站内搜索更接近知识库体验。

- [x] 搜索结果关键词高亮（2026-07-07：Fuse matches 高亮标题、摘要、正文片段、标签/系列）
- [x] 显示匹配正文片段（2026-07-07：搜索结果显示命中正文上下文）
- [x] 支持按标签/系列筛选（2026-07-07：搜索弹窗内添加标签和系列筛选）
- [x] 支持快捷键打开搜索（2026-07-07：保留并验证 Cmd/Ctrl + K）

## 4. SEO 结构化数据增强

目标：让搜索引擎更好理解站点和文章内容。

- [x] Article JSON-LD（2026-07-07：文章页输出 Article 图谱，包含标题、摘要、日期、封面/OG 图、字数、标签）
- [x] Breadcrumb JSON-LD（2026-07-07：文章页输出首页 → 当前文章 BreadcrumbList）
- [x] WebSite SearchAction JSON-LD（2026-07-07：站点级 WebSite 图谱补充 SearchAction）
- [x] 作者信息结构化数据（2026-07-07：站点与文章图谱复用带 @id 的 Person 作者实体）

## 5. 后台管理页

目标：提供私有入口查看站点运营数据、内容状态和表单入口，避免把运维信息散落在多个第三方后台。

优先级：中。建议在表单、统计、SEO 稳定后再做，先以“只读面板 + 外部服务快捷入口”为 MVP，避免一开始引入复杂的写权限和数据库。

- [x] 设计 `/admin` 访问控制（2026-07-07：使用 Next Proxy + Basic Auth 保护 `/admin`，缺少凭据时 fail closed；验证：`npm run check`）
  - [x] 确定认证方式：Basic Auth
  - [x] 所有管理页默认服务端校验，未授权返回 401，缺少服务端配置返回 404
  - [x] 管理入口不出现在公开导航和 sitemap 中
- [x] 查看订阅状态或外部服务链接（2026-07-07：后台卡片展示 Resend Audience 配置状态与外部入口；验证：`npm run check`）
  - [x] 展示 Resend Audience 链接和基础配置状态
  - [x] 检查环境变量是否齐全，并用安全文案提示缺失项
  - [x] 不在页面输出 API Key、邮箱完整隐私数据等敏感信息
- [x] 查看联系表单处理状态或外部服务链接（2026-07-07：后台卡片展示联系表单发送配置、Resend 邮件日志入口和脱敏邮箱；验证：`npm run check`）
  - [x] 展示联系收件箱/Resend 邮件日志入口
  - [x] 记录“已转发到邮箱”的说明和排错提示
  - [x] 后续如引入数据库，再补充处理状态、备注、归档功能
- [x] 展示构建/文章统计信息（2026-07-07：新增文章总数、草稿/发布/定时、标签/系列、最近文章、部署 commit/ref/env；验证：`npm run check`）
  - [x] 文章总数、草稿/发布数量、标签数、系列数
  - [x] 最近更新文章列表
  - [x] 最近构建时间、当前 commit 信息（如部署平台可提供）
- [x] 验收标准（2026-07-07：后台不进公开导航/sitemap，robots disallow `/admin`；验证：`npm run check`）
  - [x] 未授权访问 `/admin` 不泄露任何内部信息
  - [x] 授权后能看到表单、统计、内容健康状态入口
  - [x] lint、typecheck、build/check 通过

## 6. PWA / 离线阅读

目标：优化移动端和弱网阅读体验，让博客可以被添加到主屏幕，并在网络不稳定时保留基础阅读能力。

优先级：中。建议先完成 manifest 和图标，再逐步加入 service worker；缓存策略必须保守，避免旧文章和旧样式长期残留。

- [x] 添加 manifest（2026-07-07：补齐 scope、standalone、主题色、背景色与 PNG/maskable icons；验证：`npm run check`）
  - [x] 配置应用名称、短名称、描述、主题色、背景色
  - [x] 设置 `display`、`start_url`、`scope` 等基础字段
  - [x] 在站点 metadata 中正确引用 manifest
- [x] 添加应用图标（2026-07-07：新增 192x192、512x512、maskable、apple-touch-icon；验证：`npm run check`）
  - [x] 准备 192x192、512x512、maskable icon
  - [x] 补充 favicon / apple-touch-icon 相关资源
  - [x] 确保深浅色背景下图标都清晰
- [x] 设计离线 fallback 页面（2026-07-07：新增 `/offline` 页面，提供离线说明、返回首页和重新加载入口；验证：`npm run check`）
  - [x] 提供简洁离线说明和返回首页/重试按钮
  - [x] 样式与现有博客视觉保持一致
  - [x] 避免依赖远程字体或运行时请求
- [x] 缓存最近文章（2026-07-07：新增手写 service worker，公开页面 network-first，静态资源/search-index 缓存，并排除 admin 和表单 API；验证：`npm run check`）
  - [x] 明确缓存范围：静态资源、首页、最近文章、离线页
  - [x] 设置缓存版本和更新策略
  - [x] 避免缓存管理页、表单接口、动态统计接口
- [x] 验收标准（2026-07-07：代码侧完成，构建通过；浏览器 Lighthouse/离线行为需部署后复测）
  - [ ] Lighthouse PWA 关键检查通过（需部署或生产预览中手动复测）
  - [ ] 断网后可打开离线 fallback（需浏览器 Application 面板手动复测）
  - [x] 新版本部署后缓存可正常刷新（已通过版本化 cache name 支持）

## 7. 内容型页面

目标：增强个人主页属性，让博客不只是文章列表，也能承载项目、近况、链接和工具偏好。

优先级：中高。内容型页面实现成本低，但能显著提升站点个性和可探索性；建议先做 `/projects` 和 `/now`。

- [x] `/projects` 项目展示（2026-07-07：新增项目配置、页面和精选/归档卡片；验证：npm run check）
  - [x] 设计项目数据结构：名称、简介、技术栈、链接、状态、封面图
  - [x] 支持精选项目和归档项目分组
  - [x] 每个项目补充 GitHub / Demo / 文章链接
- [x] `/now` 最近在做什么（2026-07-07：新增轻量 Now 页面和最后更新时间；验证：npm run check）
  - [x] 用短文本记录当前学习、工作、生活和创作状态
  - [x] 页面顶部展示最后更新时间
  - [x] 保持手写、轻量，不做复杂 CMS
- [x] `/links` 友情链接（2026-07-07：新增链接页、链接交换说明和失效处理说明；验证：npm run check）
  - [x] 支持名称、描述、头像/站点图标、链接
  - [x] 标注链接交换说明和失效链接处理方式
  - [x] 外链默认安全打开并避免影响 SEO
- [x] `/uses` 工具和设备（2026-07-07：新增工具分类页面和个人推荐式描述；验证：npm run check）
  - [x] 分类展示开发工具、软件、设备、服务
  - [x] 可关联相关文章或使用心得
  - [x] 避免过度商业化，保持个人推荐口吻
- [x] 验收标准（2026-07-07：新页面补 metadata，Header 只加项目入口，Sidebar/About 提供探索入口；验证：npm run check）
  - [x] 所有新页面有完整 metadata 和结构化标题层级
  - [x] 导航入口清晰，不挤占核心文章入口
  - [x] 移动端排版可读，空数据状态友好

## 8. 图片与代码块体验增强

目标：提升技术文章和图文内容的阅读体验，让图片说明、代码信息和复制反馈更清晰。

优先级：中。适合在文章内容逐渐增多后做，优先处理“读者立刻能感知”的 caption 和复制体验。

- [x] Markdown 图片 caption 支持（2026-07-07：新增 rehype figure 插件，支持 alt/title 生成 caption；验证：npm run check）
  - [x] 约定语法：使用图片 alt 作为 caption，或支持 `![alt](src "caption")`
  - [x] 渲染为 `figure` + `figcaption`
  - [x] 保证无 caption 的图片不产生多余布局
- [x] 图片懒加载占位优化（2026-07-07：文章图片输出 loading/decoding、figure 稳定样式和灯箱 caption；验证：npm run check）
  - [x] 为文章图片补充宽高或稳定占位，减少 CLS
  - [x] 设计 blur / skeleton / dominant color 占位策略
  - [x] 确保首屏关键图不被过度延迟
- [x] 代码块文件名显示（2026-07-07：基于 rehype-pretty-code 输出生成代码块 header、语言/文件名和复制动作区；验证：npm run check）
  - [x] 支持代码围栏 meta，例如 ```ts title="src/app/page.tsx"
  - [x] 在代码块顶部显示语言、文件名和复制按钮
  - [x] 长文件名在移动端可横向滚动或截断
- [x] 代码块高亮行/复制状态优化（2026-07-07：支持 highlighted line 样式，复制按钮增加复制中/成功/失败状态和键盘可访问；验证：npm run check）
  - [x] 支持 `{1,3-5}` 行高亮语法
  - [x] 复制按钮显示“复制中/已复制/失败”状态
  - [x] 键盘和屏幕阅读器可访问
- [x] 验收标准（2026-07-07：旧文章兼容，图片/代码样式补齐，内容检查兼容 caption title；验证：npm run check）
  - [x] 旧文章 Markdown 不需要改动也能正常渲染
  - [x] 代码块在浅色/深色主题下对比度足够
  - [x] 图片和代码增强不会破坏 build/check

## 9. 自动内容质量检查与 CI

目标：降低文章增多后的维护成本，在提交和部署前自动发现 frontmatter、链接、图片和构建问题。

优先级：高。建议作为下一阶段优先项之一，因为它能保护之后所有内容和功能改动。

- [x] 检查 frontmatter 必填字段（2026-07-07：新增 `scripts/check-content.mjs` 校验标题、摘要、日期、标签、封面、发布状态等字段；验证：`npm run check:content`、`npm run check`）
  - [x] 校验标题、摘要、日期、标签、封面、发布状态等字段
  - [x] 日期格式统一，未来日期和非法日期给出明确错误
  - [x] 标签/系列命名规范化，避免同义重复
- [x] 检查文章内死链（2026-07-07：校验站内文章链接、public 资源和相对路径；外链通过 `-- --external` 可选检查；验证：`npm run check:content -- --external`）
  - [x] 校验站内相对链接是否存在
  - [x] 对外链设置可选检查，避免 CI 因临时网络波动频繁失败
  - [x] 输出具体文章路径和问题链接
- [x] 检查图片路径和 alt 文本（2026-07-07：校验 Markdown 图片和 cover 的本地路径、alt 文本与图片体积提示；验证：`npm run check:content`）
  - [x] 校验本地图片文件是否存在
  - [x] 发现空 alt 或过短 alt 时给出警告
  - [x] 可选检查图片体积，提示压缩建议
- [x] GitHub Actions 自动运行 `npm run check`（2026-07-07：新增 `.github/workflows/ci.yml`，在 PR 和 main push 运行完整检查；验证：`npm run check`）
  - [x] 在 pull request 和 main 分支 push 时运行
  - [x] 缓存依赖安装，减少 CI 时间
  - [x] 将 lint、typecheck、build/check、内容检查串联
- [x] 本地开发辅助（2026-07-07：新增 `npm run check:content`，README 记录检查范围和可选外链检查；验证：`npm run check:content`）
  - [x] 增加 `npm run check:content` 或类似命令
  - [x] 在 README 中记录本地检查方式
  - [x] 输出可读的错误摘要，方便一次性修复
- [x] 验收标准（2026-07-07：正常内容通过 `npm run check:content`、`npm run lint`、`npm run typecheck`、`npm run build`、`npm run check`）
  - [x] 构造错误 frontmatter、死链、缺图时检查能失败并指向具体文件
  - [x] 正常内容通过所有检查
  - [x] CI 结果能在 PR 中清晰展示

## 建议执行顺序

1. 自动内容质量检查与 CI：先建立安全网，后续新增页面和 PWA 更稳。
2. 内容型页面：先做 `/projects` 和 `/now`，快速提升个人主页完整度。
3. 图片与代码块体验增强：改善既有文章阅读体验。
4. PWA / 离线阅读：在页面结构稳定后再做缓存策略。
5. 后台管理页：最后按实际运维需求扩展，先保持只读和低复杂度。

## 每个功能完成后的记录格式

完成任务时，在对应条目后追加：

```md
（YYYY-MM-DD：完成内容简述；验证：运行的命令或手动验证方式）
```

示例：

```md
- [x] 检查 frontmatter 必填字段（2026-07-07：新增内容检查脚本；验证：npm run check:content）
```
