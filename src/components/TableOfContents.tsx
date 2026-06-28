"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { TocHeading } from "@/lib/posts";
import { useI18n } from "@/lib/i18n";

interface Props {
  headings: TocHeading[];
  /** 是否显示"目录"标题。在移动端 details/summary 中可设为 false */
  showTitle?: boolean;
}

export default function TableOfContents({ headings, showTitle = true }: Props) {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<string>("");
  const visibleSet = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  // 滚动监听：高亮当前可见区域最靠前的标题
  useEffect(() => {
    if (headings.length === 0) return;

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
        const firstVisible = headings.find((h) =>
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
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // 初始加载时，检查 URL hash 作为初始高亮
  useEffect(() => {
    if (initialized.current || headings.length === 0) return;
    initialized.current = true;

    const hash = window.location.hash.slice(1);
    if (hash && headings.some((h) => h.id === hash)) {
      setActiveId(hash);

      // 延迟滚动到锚点位置（等页面完全渲染后）
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, [headings]);

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

  if (headings.length === 0) return null;

  return (
    <nav aria-label={t("toc.ariaLabel")} className="toc-nav">
      {showTitle && (
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 tracking-wide">
          {t("toc.title")}
        </h4>
      )}

      <ul className="space-y-0.5">
        {headings.map((h) => {
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
                      ? "border-orange-500 text-orange-600 font-medium dark:text-orange-400"
                      : "border-transparent text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400"
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
