"use client";

/**
 * 客户端国际化（i18n）
 *
 * 架构要点：
 * - 仅客户端渲染，服务端默认输出中文（避免 SSR/CSR 水合不匹配）
 * - 语言偏好持久化到 localStorage，切换时同步更新 <html lang="...">
 * - 翻译字典以 key-value 平铺存储，用 t("section.key") 调用
 * - I18nProvider 必须在布局顶层包裹，所有客户端组件通过 useI18n() 消费
 */
import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Locale = "zh" | "en";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  zh: {
    // 导航
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.tags": "标签",
    "nav.search": "搜索",
    "nav.projects": "项目",
    "nav.now": "Now",
    "nav.links": "链接",
    "nav.uses": "Uses",
    "nav.explore": "探索",

    // 首页
    "home.greeting": "欢迎来到露比的工作室",
    "home.tagline": "这里记录一些关于技术、思考和生活的内容。写作帮助我理清思路，也希望对你有所启发。",
    "home.latestPosts": "最新文章",

    // 热门文章
    "popular.title": "热门文章",
    "popular.empty": "暂无热门文章",

    // 文章页
    "post.notFound": "未找到",
    "post.backHome": "返回首页",
    "post.readingTime": "分钟阅读",
    "post.toc": "目录",

    // 评论
    "comments.title": "评论",
    "comments.desc": "欢迎留下你的想法、问题或补充，评论通过 GitHub Discussions 提供支持。",
    "comments.loading": "评论加载中...",
    "comments.missingTitle": "评论暂时不可用",
    "comments.missingDesc": "请先在环境变量中配置 Giscus 的 repoId 和 categoryId，然后重新部署。",
    "comments.setupGuide": "前往 giscus.app 获取配置 →",
    "comments.reload": "重新加载评论",
    "comments.loadErrorDesc": "评论加载超时，请检查网络连接后点击重试。",

    // 标签页
    "tags.title": "标签",
    "tags.description": "按标签浏览文章，找到你感兴趣的内容。",
    "tags.metaTitle": "标签",
    "tags.metaDesc": "按标签浏览文章",
    "tags.allTags": "所有标签",
    "tags.articleCount": "共 {count} 篇文章",
    "tags.tagPrefix": "标签：",
    "tags.tagMetaDesc": "包含「{tag}」标签的所有文章",

    // 关于页
    "about.title": "关于",
    "about.intro": "你好，我是 LunaPath。",
    "about.bio": "这里是我记录技术学习、生活思考和阅读笔记的地方。写作帮助我整理思路，也希望能为你带来一些价值。",
    "about.contact": "联系方式",
    "about.contactDesc": "可以通过 GitHub 找到我，或者在文章下方留言讨论。",
    "about.more": "更多页面",
    "about.moreProjects": "正在打磨的项目、实验和作品。",
    "about.moreNow": "最近在学习、创作和关注什么。",
    "about.moreLinks": "收藏的站点和友情链接说明。",
    "about.moreUses": "常用工具、软件和服务。",

    // 内容页
    "projects.title": "项目",
    "projects.description": "这里整理我正在做、做过和持续维护的小项目。",
    "projects.featured": "精选项目",
    "projects.archive": "归档与实验",
    "projects.empty": "项目正在整理中。",
    "projects.featuredEmpty": "精选项目正在整理中。",
    "projects.readPost": "相关文章",
    "projects.status.featured": "精选",
    "projects.status.building": "建设中",
    "projects.status.archived": "已归档",
    "projects.status.paused": "暂停",
    "now.title": "Now",
    "now.description": "最近在做什么。保持轻量、手写和及时更新。",
    "now.updatedAt": "最后更新：{date}",
    "now.empty": "最近状态还在整理中。",
    "links.title": "链接",
    "links.description": "一些值得收藏的站点，以及友情链接说明。",
    "links.exchange": "链接交换",
    "links.broken": "失效处理",
    "links.empty": "链接列表正在整理中。",
    "uses.title": "Uses",
    "uses.description": "我当前使用和推荐的开发工具、软件、设备与服务。",
    "uses.empty": "工具清单正在整理中。",
    "uses.visit": "访问",
    "uses.readPost": "相关文章",

    // 订阅
    "subscribe.title": "📬 订阅博客",
    "subscribe.desc": "不想错过新文章？留下邮箱，有新内容时我会通知你。",
    "subscribe.placeholder": "your@email.com",
    "subscribe.ariaLabel": "邮箱地址",
    "subscribe.btn": "订阅",
    "subscribe.loading": "提交中...",
    "subscribe.success": "订阅成功！感谢你的关注。",
    "subscribe.errorEmpty": "请输入邮箱地址",
    "subscribe.errorFormat": "邮箱格式不正确，请检查后再试",
    "subscribe.errorTooLong": "邮箱地址太长，请检查后再试",
    "subscribe.errorFail": "订阅失败，请稍后再试",
    "subscribe.errorUnavailable": "订阅服务暂不可用，请稍后再试",
    "subscribe.errorNetwork": "网络出错了，请稍后再试",
    "subscribe.already": "你已经订阅过了！",

    // 搜索
    "search.ariaLabel": "搜索文章",
    "search.label": "搜索",
    "search.modalAria": "搜索",
    "search.placeholder": "搜索文章标题、摘要、标签...",
    "search.loading": "加载中...",
    "search.empty": "没有找到相关文章",
    "search.filters": "筛选",
    "search.filterTag": "按标签筛选",
    "search.filterSeries": "按系列筛选",
    "search.allTags": "全部标签",
    "search.allSeries": "全部系列",
    "search.clearFilters": "清除",
    "search.seriesPrefix": "系列：",
    "search.move": "移动",
    "search.goto": "跳转",
    "search.close": "关闭",

    // 目录
    "toc.ariaLabel": "文章目录",
    "toc.title": "目录",

    // 主题切换
    "theme.system": "跟随系统",
    "theme.light": "浅色模式",
    "theme.dark": "深色模式",
    "theme.ariaPrefix": "当前：",
    "theme.ariaSuffix": "，点击切换",

    // 相关文章
    "related.title": "相关文章",

    // 代码复制
    "copy.btn": "复制",
    "copy.ariaLabel": "复制代码",
    "copy.copying": "复制中...",
    "copy.success": "已复制!",
    "copy.fail": "失败",

    // Footer
    "footer.builtWith": "Built with Next.js",

    // 站点描述
    "site.description": "LunaPath 的博客，记录思考和分享知识的地方",
    "site.rssTitle": "LunaPath RSS",

    // 404 页
    "notFound.title": "页面走丢了",
    "notFound.desc": "你要找的页面不存在，可能已被移除或地址有误。",
    "notFound.backHome": "返回首页",
    "notFound.browseTags": "浏览标签",

    // 文章导航
    "post.prev": "上一篇",
    "post.next": "下一篇",
    "post.wordCount": "字",

    // 归档
    "nav.archive": "归档",

    // 联系表单
    "contact.title": "联系我",
    "contact.desc": "有任何问题或想法？欢迎通过下面的表单联系我。",
    "contact.name": "你的名字",
    "contact.namePlaceholder": "LunaPath",
    "contact.email": "邮箱地址",
    "contact.emailPlaceholder": "your@email.com",
    "contact.message": "留言内容",
    "contact.messagePlaceholder": "写下你想说的...",
    "contact.submit": "发送",
    "contact.sending": "发送中...",
    "contact.success": "发送成功！感谢你的留言。",
    "contact.errorEmpty": "请填写所有字段",
    "contact.errorEmail": "邮箱格式不正确",
    "contact.errorTooLong": "内容太长，请精简后再发送",
    "contact.errorFail": "发送失败，请稍后再试",
    "contact.errorUnavailable": "联系服务暂不可用，请稍后再试",
    "contact.errorNetwork": "网络出错了，请稍后再试",

    // 图片灯箱
    "lightbox.close": "关闭",
    "lightbox.prev": "上一张",
    "lightbox.next": "下一张",
    "lightbox.zoom": "放大",

    // 分页
    "pagination.prev": "上一页",
    "pagination.next": "下一页",
    "pagination.aria": "分页导航",

    // 社交分享
    "share.title": "分享文章",
    "share.shareTo": "分享到",
    "share.copyLink": "复制链接",
    "share.copied": "已复制!",

    // 系列文章
    "series.title": "系列文章",
  },

  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.tags": "Tags",
    "nav.search": "Search",
    "nav.projects": "Projects",
    "nav.now": "Now",
    "nav.links": "Links",
    "nav.uses": "Uses",
    "nav.explore": "Explore",

    // Home
    "home.greeting": "Hello, welcome.",
    "home.tagline": "A place for notes on tech, thoughts, and life. Writing helps me think clearly — hope it inspires you too.",
    "home.latestPosts": "Latest Posts",

    // Popular posts
    "popular.title": "Popular Posts",
    "popular.empty": "No popular posts yet",

    // Post
    "post.notFound": "Not Found",
    "post.backHome": "Back to Home",
    "post.readingTime": "min read",
    "post.toc": "Contents",

    // Comments
    "comments.title": "Comments",
    "comments.desc": "Share your thoughts, questions, or additions. Comments are powered by GitHub Discussions.",
    "comments.loading": "Loading comments...",
    "comments.missingTitle": "Comments temporarily unavailable",
    "comments.missingDesc": "Set Giscus repoId and categoryId in your environment variables, then redeploy.",
    "comments.setupGuide": "Get config at giscus.app →",
    "comments.reload": "Reload comments",
    "comments.loadErrorDesc": "Comments failed to load. Please check your connection and try again.",

    // Tags
    "tags.title": "Tags",
    "tags.description": "Browse articles by tag to find what interests you.",
    "tags.metaTitle": "Tags",
    "tags.metaDesc": "Browse articles by tag",
    "tags.allTags": "All Tags",
    "tags.articleCount": "{count} articles",
    "tags.tagPrefix": "Tag: ",
    "tags.tagMetaDesc": "All articles tagged '{tag}'",

    // About
    "about.title": "About",
    "about.intro": "Hi, I'm LunaPath.",
    "about.bio": "This is where I document my learnings in tech, reflections on life, and reading notes. Writing helps me organize my thoughts, and I hope it brings you some value too.",
    "about.contact": "Contact",
    "about.contactDesc": "You can find me on GitHub, or leave a comment below any article.",
    "about.more": "More pages",
    "about.moreProjects": "Projects, experiments, and ongoing work.",
    "about.moreNow": "What I am learning, making, and paying attention to lately.",
    "about.moreLinks": "Useful sites and blogroll notes.",
    "about.moreUses": "Tools, software, and services I use.",

    // Content pages
    "projects.title": "Projects",
    "projects.description": "Projects, experiments, and small systems I am building or maintaining.",
    "projects.featured": "Featured",
    "projects.archive": "Archive & experiments",
    "projects.empty": "Projects are being organized.",
    "projects.featuredEmpty": "Featured projects are being organized.",
    "projects.readPost": "Related post",
    "projects.status.featured": "Featured",
    "projects.status.building": "Building",
    "projects.status.archived": "Archived",
    "projects.status.paused": "Paused",
    "now.title": "Now",
    "now.description": "What I am doing lately — lightweight, hand-written, and updated when it changes.",
    "now.updatedAt": "Last updated: {date}",
    "now.empty": "Recent status is being organized.",
    "links.title": "Links",
    "links.description": "Useful sites I want to keep around, plus blogroll notes.",
    "links.exchange": "Link exchange",
    "links.broken": "Broken links",
    "links.empty": "Links are being organized.",
    "uses.title": "Uses",
    "uses.description": "Tools, software, devices, and services I currently use and recommend.",
    "uses.empty": "The uses list is being organized.",
    "uses.visit": "Visit",
    "uses.readPost": "Related post",

    // Subscribe
    "subscribe.title": "📬 Subscribe",
    "subscribe.desc": "Don't want to miss new posts? Leave your email and I'll notify you.",
    "subscribe.placeholder": "your@email.com",
    "subscribe.ariaLabel": "Email address",
    "subscribe.btn": "Subscribe",
    "subscribe.loading": "Submitting...",
    "subscribe.success": "Subscribed! Thanks for following.",
    "subscribe.errorEmpty": "Please enter your email",
    "subscribe.errorFormat": "Invalid email format, please check",
    "subscribe.errorTooLong": "Email address is too long, please check and try again",
    "subscribe.errorFail": "Subscription failed, please try again",
    "subscribe.errorUnavailable": "Subscription service is temporarily unavailable, please try again later",
    "subscribe.errorNetwork": "Network error, please try again",
    "subscribe.already": "You're already subscribed!",

    // Search
    "search.ariaLabel": "Search articles",
    "search.label": "Search",
    "search.modalAria": "Search",
    "search.placeholder": "Search titles, summaries, tags...",
    "search.loading": "Loading...",
    "search.empty": "No articles found",
    "search.filters": "Filters",
    "search.filterTag": "Filter by tag",
    "search.filterSeries": "Filter by series",
    "search.allTags": "All tags",
    "search.allSeries": "All series",
    "search.clearFilters": "Clear",
    "search.seriesPrefix": "Series: ",
    "search.move": "Move",
    "search.goto": "Go",
    "search.close": "Close",

    // TOC
    "toc.ariaLabel": "Table of contents",
    "toc.title": "Contents",

    // Theme
    "theme.system": "System",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.ariaPrefix": "Current: ",
    "theme.ariaSuffix": ", click to switch",

    // Related Posts
    "related.title": "Related Posts",

    // Code Copy
    "copy.btn": "Copy",
    "copy.ariaLabel": "Copy code",
    "copy.copying": "Copying...",
    "copy.success": "Copied!",
    "copy.fail": "Failed",

    // Footer
    "footer.builtWith": "Built with Next.js",

    // Site description
    "site.description": "LunaPath's blog — notes on tech, thoughts, and life",
    "site.rssTitle": "LunaPath RSS",

    // 404
    "notFound.title": "Page Not Found",
    "notFound.desc": "The page you're looking for doesn't exist — it may have been moved or the link is incorrect.",
    "notFound.backHome": "Back to Home",
    "notFound.browseTags": "Browse Tags",

    // Post nav
    "post.prev": "Previous",
    "post.next": "Next",
    "post.wordCount": "words",

    // Archive
    "nav.archive": "Archive",

    // Contact form
    "contact.title": "Contact Me",
    "contact.desc": "Have a question or thought? Feel free to reach out via the form below.",
    "contact.name": "Your Name",
    "contact.namePlaceholder": "LunaPath",
    "contact.email": "Email Address",
    "contact.emailPlaceholder": "your@email.com",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Write your message...",
    "contact.submit": "Send",
    "contact.sending": "Sending...",
    "contact.success": "Message sent! Thanks for reaching out.",
    "contact.errorEmpty": "Please fill in all fields",
    "contact.errorEmail": "Invalid email format",
    "contact.errorTooLong": "Message is too long, please shorten it and try again",
    "contact.errorFail": "Failed to send, please try again",
    "contact.errorUnavailable": "Contact service is temporarily unavailable, please try again later",
    "contact.errorNetwork": "Network error, please try again",

    // Lightbox
    "lightbox.close": "Close",
    "lightbox.prev": "Previous",
    "lightbox.next": "Next",
    "lightbox.zoom": "Zoom",

    // Pagination
    "pagination.prev": "Prev",
    "pagination.next": "Next",
    "pagination.aria": "Pagination",

    // Share
    "share.title": "Share",
    "share.shareTo": "Share to",
    "share.copyLink": "Copy Link",
    "share.copied": "Copied!",

    // Series
    "series.title": "Series",
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    requestAnimationFrame(() => {
      if (stored === "zh" || stored === "en") {
        setLocaleState(stored);
      }
      setMounted(true);
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale === "zh" ? "zh-CN" : "en";
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale] ?? translations.zh;
      return dict[key] ?? key;
    },
    [locale]
  );

  // 防止水合不匹配
  if (!mounted) {
    const tServer = (key: string) => translations.zh[key] ?? key;
    return (
      <I18nContext.Provider value={{ locale: "zh", setLocale, t: tServer }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
