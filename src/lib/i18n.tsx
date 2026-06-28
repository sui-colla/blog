"use client";

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

    // 首页
    "home.greeting": "你好，欢迎来访。",
    "home.tagline": "这里记录一些关于技术、思考和生活的内容。写作帮助我理清思路，也希望对你有所启发。",
    "home.latestPosts": "最新文章",

    // 文章页
    "post.notFound": "未找到",
    "post.backHome": "返回首页",
    "post.readingTime": "分钟阅读",
    "post.toc": "目录",

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
    "subscribe.errorFail": "订阅失败，请稍后再试",
    "subscribe.errorNetwork": "网络出错了，请稍后再试",
    "subscribe.already": "你已经订阅过了！",

    // 搜索
    "search.ariaLabel": "搜索文章",
    "search.label": "搜索",
    "search.modalAria": "搜索",
    "search.placeholder": "搜索文章标题、摘要、标签...",
    "search.loading": "加载中...",
    "search.empty": "没有找到相关文章",
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
  },

  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.tags": "Tags",
    "nav.search": "Search",

    // Home
    "home.greeting": "Hello, welcome.",
    "home.tagline": "A place for notes on tech, thoughts, and life. Writing helps me think clearly — hope it inspires you too.",
    "home.latestPosts": "Latest Posts",

    // Post
    "post.notFound": "Not Found",
    "post.backHome": "Back to Home",
    "post.readingTime": "min read",
    "post.toc": "Contents",

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
    "subscribe.errorFail": "Subscription failed, please try again",
    "subscribe.errorNetwork": "Network error, please try again",
    "subscribe.already": "You're already subscribed!",

    // Search
    "search.ariaLabel": "Search articles",
    "search.label": "Search",
    "search.modalAria": "Search",
    "search.placeholder": "Search titles, summaries, tags...",
    "search.loading": "Loading...",
    "search.empty": "No articles found",
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
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored === "zh" || stored === "en") {
      setLocaleState(stored);
    }
    setMounted(true);
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
