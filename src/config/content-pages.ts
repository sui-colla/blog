/**
 * 内容页数据配置
 *
 * 项目（Projects）、Now、链接（Links）、Uses 四个内容页的数据结构和静态数据均在此定义。
 * 修改这些内容后重新构建即可生效，无需数据库。
 */
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
    name: "参数化零件生成器",
    summary: "用参数文件驱动 FreeCAD 批量生成板件与孔阵列，输出 STEP、缩略图和尺寸表，方便做系列化设计。",
    techStack: ["Python", "FreeCAD", "参数化设计"],
    status: "featured",
    postUrl: "/posts/parametric-design-constraints",
  },
  {
    name: "二维热传导求解器",
    summary: "基于有限差分的平板温度场求解实验，包含稳定性检查、解析解对照和网格无关性验证。",
    techStack: ["Python", "NumPy", "数值仿真"],
    status: "building",
    postUrl: "/posts/finite-difference-heat-simulation",
  },
  {
    name: "网格处理实验集",
    summary: "从索引面集到半边结构的实现练习，覆盖邻接查询、法线计算、边界处理和非流形检查。",
    techStack: ["Python", "计算几何", "半边结构"],
    status: "building",
    postUrl: "/posts/mesh-half-edge-data-structure",
  },
  {
    name: "硬表面资产库",
    summary: "按统一管线整理的机械零件资产：Blockout、高低模、UV、PBR 贴图与导出检查清单。",
    techStack: ["Blender", "PBR", "三维建模"],
    status: "building",
    postUrl: "/posts/blender-hard-surface-pipeline",
  },
];

export const nowPage: NowPageData = {
  updatedAt: "2026-10-21",
  sections: [
    {
      title: "学习",
      items: ["补计算几何与数值方法的基础，重点是把推导落到可运行的代码。", "整理三维建模管线中的拓扑、UV 与烘焙问题。"],
    },
    {
      title: "创作",
      items: ["把建模、仿真和参数化设计的实践写成可复用的笔记。", "维护一个从几何到验证的小型工具链，而不是零散脚本。"],
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
