"use client";

/**
 * 文章目录（对应 Fuwari TOC）
 *
 * 一级标题带数字徽标，二级标题用圆点；当前阅读位置高亮。
 * 高亮原理：IntersectionObserver 监听标题可见性，取可见区域中最靠前的标题。
 */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { TocHeading } from "@/lib/content/posts";
import { useI18n } from "@/lib/i18n";

interface Props {
  headings: TocHeading[];
  /** 是否显示"目录"标题 */
  showTitle?: boolean;
  /** 限制显示的标题层级，例如 [2, 3]。 */
  levels?: number[];
}

export default function TableOfContents({
  headings,
  showTitle = true,
  levels,
}: Props) {
  const { t } = useI18n();
  const displayHeadings = useMemo(
    () =>
      levels
        ? headings.filter((heading) => levels.includes(heading.level))
        : headings,
    [headings, levels]
  );

  const items = useMemo(() => {
    if (displayHeadings.length === 0) return [];
    const minLevel = Math.min(...displayHeadings.map((h) => h.level));
    let counter = 0;
    return displayHeadings.map((heading) => {
      const isTop = heading.level === minLevel;
      if (isTop) counter += 1;
      return {
        ...heading,
        isTop,
        number: isTop ? counter : null,
      };
    });
  }, [displayHeadings]);

  const [activeId, setActiveId] = useState<string>("");
  const visibleSet = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

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

        const firstVisible = displayHeadings.find((h) =>
          visibleSet.current.has(h.id)
        );
        if (firstVisible) {
          setActiveId(firstVisible.id);
        }
      },
      {
        rootMargin: "-80px 0px -65% 0px",
      }
    );

    requestAnimationFrame(() => {
      for (const h of displayHeadings) {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [displayHeadings]);

  useEffect(() => {
    if (initialized.current || displayHeadings.length === 0) return;
    initialized.current = true;

    const hash = window.location.hash.slice(1);
    if (hash && displayHeadings.some((h) => h.id === hash)) {
      requestAnimationFrame(() => {
        setActiveId(hash);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, [displayHeadings]);

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
    []
  );

  if (items.length === 0) return null;

  return (
    <nav aria-label={t("toc.ariaLabel")} className="toc-nav">
      {showTitle && <h4 className="toc-title">{t("toc.title")}</h4>}

      <ul>
        {items.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                title={heading.text}
                onClick={(e) => handleClick(e, heading.id)}
                className={`toc-link${heading.isTop ? "" : " toc-link--sub"}${
                  isActive ? " toc-link--active" : ""
                }`}
              >
                <span className="toc-badge" aria-hidden="true">
                  {heading.number}
                </span>
                <span>{heading.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
