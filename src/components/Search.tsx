"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse, { type FuseResult } from "fuse.js";

interface SearchItem {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult<SearchItem>[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  // 加载搜索索引
  const loadIndex = useCallback(async () => {
    if (fuse) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search-index");
      const items: SearchItem[] = await res.json();
      const instance = new Fuse(items, {
        keys: [
          { name: "title", weight: 3 },
          { name: "summary", weight: 2 },
          { name: "tags", weight: 1.5 },
          { name: "content", weight: 1 },
        ],
        threshold: 0.4,
        includeMatches: true,
        minMatchCharLength: 2,
      });
      setFuse(instance);
    } catch {
      // 静默失败
    } finally {
      setLoading(false);
    }
  }, [fuse]);

  // 全局快捷键 Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) loadIndex();
          return !prev;
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loadIndex]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // 搜索
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setActiveIndex(0);
      return;
    }
    const items = fuse.search(query.trim());
    setResults(items);
    setActiveIndex(0);
  }, [query, fuse]);

  // 键盘导航
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      navigateTo(results[activeIndex].item.slug);
    }
  }

  // 跳转到文章
  function navigateTo(slug: string) {
    setOpen(false);
    router.push(`/posts/${slug}`);
  }

  // 滚动到当前选中项
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      activeEl?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // 高亮匹配文字
  function highlightMatch(text: string, key: string): React.ReactNode {
    const match = results[activeIndex]?.matches?.find((m) => m.key === key);
    if (!match) return text;

    const indices = match.indices as [number, number][];
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const [start, end] of indices) {
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }
      parts.push(
        <mark key={start} className="search-highlight">
          {text.slice(start, end + 1)}
        </mark>
      );
      lastIndex = end + 1;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  }

  return (
    <>
      {/* 搜索触发按钮 */}
      <button
        onClick={() => {
          loadIndex();
          setOpen(true);
        }}
        className="search-trigger"
        aria-label="搜索文章"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline">搜索</span>
        <kbd className="search-kbd hidden sm:inline">⌘K</kbd>
      </button>

      {/* 搜索模态框 */}
      {open && (
        <div
          className="search-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="search-modal" role="dialog" aria-label="搜索">
            {/* 搜索输入框 */}
            <div className="search-input-wrapper">
              <svg
                className="search-input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder="搜索文章标题、摘要、标签..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              {loading && <span className="search-loading">加载中...</span>}
            </div>

            {/* 搜索结果 */}
            {query.trim() && (
              <div className="search-results">
                {results.length === 0 ? (
                  <div className="search-empty">没有找到相关文章</div>
                ) : (
                  <ul ref={listRef} role="listbox">
                    {results.map((result, index) => (
                      <li
                        key={result.item.slug}
                        role="option"
                        aria-selected={index === activeIndex}
                        className={`search-result-item ${
                          index === activeIndex ? "search-result-active" : ""
                        }`}
                        onClick={() => navigateTo(result.item.slug)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <h4 className="search-result-title">
                          {highlightMatch(result.item.title, "title")}
                        </h4>
                        <p className="search-result-summary">
                          {highlightMatch(result.item.summary, "summary")}
                        </p>
                        {result.item.tags.length > 0 && (
                          <div className="search-result-tags">
                            {result.item.tags.map((tag) => (
                              <span key={tag} className="search-result-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 底部提示 */}
            <div className="search-footer">
              <span>
                <kbd className="search-kbd">↑↓</kbd> 移动
              </span>
              <span>
                <kbd className="search-kbd">Enter</kbd> 跳转
              </span>
              <span>
                <kbd className="search-kbd">Esc</kbd> 关闭
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
