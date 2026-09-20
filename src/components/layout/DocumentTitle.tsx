"use client";

/**
 * 客户端纠正浏览器标签页标题
 *
 * 为什么需要它
 * - locale 存在浏览器本地，服务端读不到，所以各页 metadata 由服务端固定渲染成中文。
 *   这对本站其实是**对的**：文章与页面正文本身就是中文，给中文内容配英文 SEO 标题
 *   反而有害（与内容语言不符，还可能被当成重复内容）。所以服务端保持中文不动。
 * - 但界面上确实存在一个可见的不一致：切到英文后页面标题显示 About，
 *   浏览器标签页却还是「关于」。
 *
 * 做法与 <html lang> 完全一致 —— 在客户端纠正：
 * 爬虫看到服务端渲染的中文（与内容语言一致），
 * 人看到与自己所选语言一致的标签页标题。
 *
 * 注意这里**同时处理中英两种语言**：从英文切回中文时标签页标题不会自动复原
 * （客户端路由切换时 Next.js 会重设，但纯语言切换不会），所以两个方向都要显式设置。
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useI18n, translate } from "@/lib/i18n";
import { siteConfig } from "@/config/site";

/** 静态页面路由 → 标题文案 key */
const STATIC_TITLE_KEYS: Record<string, string> = {
  "/about": "nav.about",
  "/archive": "nav.archive",
  "/tags": "nav.tags",
  "/projects": "nav.projects",
  "/links": "nav.links",
  "/now": "nav.now",
  "/uses": "nav.uses",
};

const TAGS_PREFIX = "/tags/";

function titleKeyFor(pathname: string): { key: string; prefix?: string } | null {
  const staticKey = STATIC_TITLE_KEYS[pathname];
  if (staticKey) return { key: staticKey };

  // 标签详情页：服务端渲染成「标签：xxx」，英文应为「Tag: xxx」
  if (pathname.startsWith(TAGS_PREFIX)) {
    const tag = decodeURIComponent(pathname.slice(TAGS_PREFIX.length));
    if (tag) return { key: "tags.tagPrefix", prefix: tag };
    return { key: "nav.tags" };
  }

  return null;
}

export default function DocumentTitle() {
  const pathname = usePathname();
  const { locale } = useI18n();

  useEffect(() => {
    const target = titleKeyFor(pathname);
    if (!target) return;

    const label = translate(target.key, locale) + (target.prefix ?? "");
    const full = `${label} | ${siteConfig.name}`;

    const apply = () => {
      if (document.title !== full) document.title = full;
    };

    apply();

    // ⚠️ 光赋值不够。Next.js 在水合与客户端路由之后会重新应用服务端渲染的
    // metadata 标题，时机不确定 —— 实测约有一半概率把上面这次赋值覆盖回去。
    // 所以持续观察 <title>，被改回去就再纠正一次。
    // apply() 只在值不同时才写，不会与 Next 形成来回覆盖的循环。
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [pathname, locale]);

  return null;
}
