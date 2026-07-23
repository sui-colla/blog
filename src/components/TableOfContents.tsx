"use client";

/**
 * 文章目录（Table of Contents）
 *
 * 高亮原理：
 * - IntersectionObserver 监听所有标题元素的可见性
 * - rootMargin: "-80px 0px -65% 0px" 含义：
 *   · top -80px 避开 sticky header
 *   · bottom -65% 只检测视口上方 35% 区域，确保高亮的是"正在阅读"的章节
 * - visibleSet 记录当前可见的标题 id，取 DOM 顺序中第一个作为 activeId
 *
 * 初始加载时检查 URL hash，自动滚动到锚点位置并高亮对应目录项。
 */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { TocHeading } from "@/lib/posts";
import { useI18n } from "@/lib/i18n";

interface Props {
  headings: TocHeading[];
  /** 是否显示"目录"标题。在移动端 details/summary 中可设为 false */
  showTitle?: boolean;
  /** 限制显示的标题层级，例如桌面端仅显示 h2。 */
  levels?: number[];
}

export default function TableOfContents({ headings, showTitle = true, levels }: Props) {
  const { t } = useI18n();
  const displayHeadings = useMemo(
    () => (levels ? headings.filter((heading) => levels.includes(heading.level)) : headings),
    [headings, levels]
  );
  const [activeId, setActiveId] = useState<string>("");
  const visibleSet = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  // 滚动监听：高亮当前可见区域最靠前的标题
  useEffect(() => {
    if (displayHeadings.length === 0) return;
    visibleSet.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibleSet.current.add(id);
          } else {
            visibleSet.current.delete(id);
          }
        }

        // 找到 DOM 顺序中第一个当前可见的标题
        const firstVisible = displayHeadings.find((h) =>
          visibleSet.current.has(h.id),
        );
        if (firstVisible) {
          setActiveId(firstVisible.id);
        }
      },
      {
        // top -80px 让过 sticky header，bottom -65% 只取页面上方 35% 区域
        rootMargin: "-80px 0px -65% 0px",
      },
    );

    // 延迟一帧再观察，确保 DOM 已渲染
    requestAnimationFrame(() => {
      for (const h of displayHeadings) {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [displayHeadings]);

  // 初始加载时，检查 URL hash 作为初始高亮
  useEffect(() => {
    if (initialized.current || displayHeadings.length === 0) return;
    initialized.current = true;

    const hash = window.location.hash.slice(1);
    if (hash && displayHeadings.some((h) => h.id === hash)) {
      // 延迟滚动到锚点位置（等页面完全渲染后）
      requestAnimationFrame(() => {
        setActiveId(hash);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, [displayHeadings]);

  // 点击目录项：平滑滚动 + 更新 URL hash
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `#${id}`);
        setActiveId(id);
      }
    },
    [],
  );

  if (displayHeadings.length === 0) return null;

  return (
    <nav aria-label={t("toc.ariaLabel")} className="toc-nav">
      {showTitle && (
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 tracking-wide">
          {t("toc.title")}
        </h4>
      )}

      <ul className="space-y-0.5">
        {displayHeadings.map((h) => {
          const isActive = h.id === activeId;
          const indent =
            h.level === 3 ? "pl-6" : h.level === 4 ? "pl-9" : "pl-3";

          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                title={h.text}
                onClick={(e) => handleClick(e, h.id)}
                className={`
                  toc-link block py-1.5 -ml-px border-l-2 text-sm leading-snug
                  truncate transition-colors
                  ${indent}
                  ${
                    isActive
                      ? "border-teal-700 text-teal-800 font-medium dark:text-teal-300"
                      : "border-transparent text-zinc-500 hover:text-teal-800 dark:text-zinc-400 dark:hover:text-teal-300"
                  }
                `}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
