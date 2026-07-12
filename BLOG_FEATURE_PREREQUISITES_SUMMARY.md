# 博客功能前提条件总结

本文整理当前博客里“需要先准备某些条件，功能才能完整生效”的部分，方便上线前逐项检查。

## 一、必须先配置的外部条件

| 功能 | 需要先准备什么 | 缺失时的表现 |
| --- | --- | --- |
| 站点基础域名 / SEO | 配置 `NEXT_PUBLIC_SITE_URL` | 会回退到默认域名 `https://xiaojiccc.xyz`；生产环境仍建议显式设置该变量 |
| 订阅表单 | `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` | 订阅接口会返回服务不可用，无法写入 Audience |
| 联系表单 | `RESEND_API_KEY` + `FORMS_FROM_EMAIL` + `CONTACT_TO_EMAIL` | 联系表单无法发送邮件 |
| 评论系统 | `NEXT_PUBLIC_GISCUS_REPO_ID` + `NEXT_PUBLIC_GISCUS_CATEGORY_ID`，并且 GitHub 仓库已开启 Discussions、分类已创建 | 评论区会显示缺少配置的提示，不加载 Giscus |
| 后台 `/admin` | `ADMIN_USERNAME` + `ADMIN_PASSWORD` | 后台会 fail closed，不渲染管理面板 |
| 访问统计 | 配置 Umami 网站 ID，通常还要有可用的脚本地址和对应站点 | 不会输出统计脚本，后台也会显示未配置 |

## 二、上线后才能完整体验的功能

| 功能 | 需要先准备什么 | 说明 |
| --- | --- | --- |
| PWA / 离线阅读 | 生产构建并部署到支持 Service Worker 的环境；浏览器首次访问后才能缓存页面 | 本地开发环境只能验证一部分效果，离线页需要生产模式和缓存数据 |
| 分享链接 / OG 图 / RSS / sitemap / robots | 站点正式域名配置正确 | 这些能力依赖统一的站点 URL 生成绝对链接 |

## 三、内容作者侧的前提

| 功能 | 需要先准备什么 | 缺失时的表现 |
| --- | --- | --- |
| 新文章发布 | 文章放在 `content/posts/*.md`，并补齐 `title`、`date`、`summary` 等必填 frontmatter | 内容检查会报错，文章也可能不会进入首页、RSS、sitemap 和搜索 |
| 定时发布 / 草稿 | 正确设置 `draft`、`publishAt` | 草稿不会公开，未来时间的文章会等到时间到再发布 |
| 文章图片与链接检查 | 本地图片路径真实存在，Markdown 图片带好 `alt`，站内链接有效 | `npm run check:content` 会失败或给出警告 |

## 四、可选但建议提前准备的配置

- `FORM_ALLOWED_ORIGINS`：限制表单提交来源，增强安全性。
- `UMAMI_DASHBOARD_URL`：在后台显示 Umami 快捷入口，方便跳转。
- 正式环境的 Resend 发件地址：建议先在 Resend 里验证发件域名或地址，再启用联系表单。

## 五、结论

这个博客里最依赖“前提条件”的功能主要是：**评论、订阅、联系表单、后台管理、访问统计、PWA 离线阅读**。  
其中前四项依赖明确的环境变量或第三方账号配置；PWA 依赖生产部署与浏览器缓存；内容发布则依赖正确的 Markdown frontmatter 和本地资源路径。

如果上线前只做最小准备，优先顺序建议是：

1. `NEXT_PUBLIC_SITE_URL`
2. `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` / `FORMS_FROM_EMAIL` / `CONTACT_TO_EMAIL`
3. `NEXT_PUBLIC_GISCUS_REPO_ID` / `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
4. `ADMIN_USERNAME` / `ADMIN_PASSWORD`
5. Umami 统计配置
6. 生产环境 PWA 验证
