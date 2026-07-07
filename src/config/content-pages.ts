export type ProjectStatus = "featured" | "building" | "archived" | "paused";

export interface ProjectItem {
  name: string;
  summary: string;
  techStack: string[];
  status: ProjectStatus;
  cover?: string;
  githubUrl?: string;
  demoUrl?: string;
  postUrl?: string;
}

export interface NowSection {
  title: string;
  items: string[];
}

export interface NowPageData {
  updatedAt: string;
  sections: NowSection[];
}

export interface LinkItem {
  name: string;
  description: string;
  url: string;
  avatar?: string;
}

export interface LinksPageData {
  exchangeNote: string;
  brokenLinkNote: string;
  links: LinkItem[];
}

export interface UsesItem {
  name: string;
  description: string;
  url?: string;
  postUrl?: string;
}

export interface UsesCategory {
  title: string;
  items: UsesItem[];
}

export const projects: ProjectItem[] = [
  {
    name: "LunaPath Blog",
    summary: "基于 Next.js 的个人博客，用来记录技术学习、游戏攻略、生活观察和持续打磨的写作系统。",
    techStack: ["Next.js", "TypeScript", "Markdown", "PWA"],
    status: "featured",
    postUrl: "/posts/nextjs-guide",
  },
  {
    name: "内容质量检查脚本",
    summary: "提交前检查文章 frontmatter、站内链接、图片路径和 alt 文本，减少内容维护成本。",
    techStack: ["Node.js", "Markdown", "CI"],
    status: "building",
  },
  {
    name: "游戏攻略知识库",
    summary: "把 CS2、GTA5、PUBG、只狼等攻略整理成可搜索、可归档的长期内容。",
    techStack: ["Writing", "Search", "Tags"],
    status: "archived",
  },
];

export const nowPage: NowPageData = {
  updatedAt: "2026-07-07",
  sections: [
    {
      title: "学习",
      items: ["继续整理 Next.js、前端工程化和内容系统相关笔记。", "把学到的东西尽量写成能复用的文章，而不只是零散记录。"],
    },
    {
      title: "创作",
      items: ["完善博客的搜索、离线阅读、内容质量检查和阅读体验。", "把游戏攻略和技术笔记都整理成更容易检索的知识库。"],
    },
    {
      title: "生活",
      items: ["保持轻量更新，给自己留出阅读、练习和休息的时间。"],
    },
  ],
};

export const linksPage: LinksPageData = {
  exchangeNote: "欢迎同样认真写作的个人站点互换链接。你可以通过关于页的联系表单发来站点名称、描述和链接。",
  brokenLinkNote: "如果发现链接失效或内容长期不可访问，我会定期清理或暂时隐藏。",
  links: [
    {
      name: "Next.js",
      description: "React 全栈框架，也是这个博客当前使用的技术底座。",
      url: "https://nextjs.org/",
    },
    {
      name: "MDN Web Docs",
      description: "查 Web 平台 API、HTML、CSS 和 JavaScript 细节时常用的参考资料。",
      url: "https://developer.mozilla.org/",
    },
    {
      name: "Anthropic",
      description: "Claude 与 AI 编程工具相关资源。",
      url: "https://www.anthropic.com/",
    },
  ],
};

export const usesCategories: UsesCategory[] = [
  {
    title: "开发工具",
    items: [
      { name: "VS Code", description: "主要编辑器，搭配终端和 AI 编程工具完成日常开发。", url: "https://code.visualstudio.com/" },
      { name: "Git", description: "版本管理和写作迭代记录。", url: "https://git-scm.com/" },
    ],
  },
  {
    title: "写作与发布",
    items: [
      { name: "Markdown", description: "博客文章的主要写作格式，简单、可迁移、适合长期维护。" },
      { name: "GitHub Actions", description: "在 PR 和主分支推送时运行内容检查、类型检查和构建。", url: "https://github.com/features/actions" },
    ],
  },
  {
    title: "服务",
    items: [
      { name: "Resend", description: "处理订阅和联系表单邮件。", url: "https://resend.com/" },
      { name: "Vercel Analytics", description: "轻量查看访问趋势和热门文章线索。", url: "https://vercel.com/analytics" },
    ],
  },
];
