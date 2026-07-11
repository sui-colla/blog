"use client";

/**
 * 全站搜索（模态框）
 *
 * 工作原理：
 * 1. 首次打开时懒加载搜索索引（GET /api/search-index）和 Fuse.js 库
 * 2. Fuse.js 在客户端执行模糊匹配，支持按标题/摘要/标签/正文/系列加权搜索
 * 3. 可选按标签或系列下拉筛选（纯客户端过滤，不重新请求）
 * 4. 匹配文本高亮：Fuse 返回的 match.indices 标记匹配区间，用 <mark> 渲染
 *
 * 快捷键：Cmd/Ctrl+K 打开/关闭，上下箭头导航，Enter 跳转，Esc 关闭
 */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type Fuse from "fuse.js";
import type { FuseResultMatch } from "fuse.js";
import { useI18n } from "@/lib/i18n";

interface SearchItem {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
  series?: string;
}

interface SearchResult {
  item: SearchItem;
  matches?: readonly FuseResultMatch[];
}

const SNIPPET_RADIUS = 56;
const SNIPPET_LENGTH = 150;

export default function Search() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const trimmedQuery = query.trim();
  const hasFilters = Boolean(selectedTag || selectedSeries);

  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    for (const item of items) {
      for (const tag of item.tags) tags.add(tag);
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b, "zh-CN"));
  }, [items]);

  const seriesOptions = useMemo(() => {
    const series = new Set<string>();
    for (const item of items) {
      if (item.series) series.add(item.series);
    }
    return Array.from(series).sort((a, b) => a.localeCompare(b, "zh-CN"));
  }, [items]);

  const results = useMemo<SearchResult[]>(() => {
    const source: SearchResult[] = trimmedQuery
      ? fuse?.search(trimmedQuery) ?? []
      : hasFilters
        ? items.map((item) => ({ item }))
        : [];

    return source.filter(({ item }) => {
      const tagMatched = !selectedTag || item.tags.includes(selectedTag);
      const seriesMatched = !selectedSeries || item.series === selectedSeries;
      return tagMatched && seriesMatched;
    });
  }, [trimmedQuery, fuse, hasFilters, items, selectedTag, selectedSeries]);

  const safeActiveIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const activeResult = results[safeActiveIndex];

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedTag("");
    setSelectedSeries("");
    setActiveIndex(0);
    // 关闭后把焦点还给触发按钮，保持键盘导航连续
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  // 懒加载：首次打开搜索时才加载 Fuse.js 库和搜索索引数据，
  // 减少首页 JS 包体积。Promise.all 并行加载两者。
  const loadIndex = useCallback(async () => {
    if (fuse || loading) return;
    setLoading(true);
    setLoadError(false);
    try {
      const [{ default: FuseConstructor }, res] = await Promise.all([
        import("fuse.js"),
        fetch("/api/search-index"),
      ]);
      if (!res.ok) throw new Error("search index request failed");
      const searchItems: SearchItem[] = await res.json();
      const instance = new FuseConstructor(searchItems, {
        keys: [
          { name: "title", weight: 3 },
          { name: "summary", weight: 2 },
          { name: "tags", weight: 1.5 },
          { name: "content", weight: 1 },
          { name: "series", weight: 0.75 },
        ],
        threshold: 0.4,
        includeMatches: true,
        minMatchCharLength: 2,
      });
      setItems(searchItems);
      setFuse(instance);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [fuse, loading]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
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

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      closeSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeResult) {
      e.preventDefault();
      navigateTo(activeResult.item.slug);
    }
  }

  function handleDialogKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      closeSearch();
      return;
    }

    if (e.key !== "Tab" || !modalRef.current) return;

    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function navigateTo(slug: string) {
    closeSearch();
    router.push(`/posts/${slug}`);
  }

  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[safeActiveIndex] as HTMLElement;
      activeEl?.scrollIntoView({ block: "nearest" });
    }
  }, [safeActiveIndex]);

  function resetActiveIndex() {
    setActiveIndex(0);
  }

  function getRanges(match: FuseResultMatch | undefined): [number, number][] {
    if (!match) return [];
    return match.indices
      .map(([start, end]) => [start, end] as [number, number])
      .sort((a, b) => a[0] - b[0]);
  }

  function highlightRanges(text: string, ranges: [number, number][] = []): React.ReactNode {
    if (ranges.length === 0) return text;

    const parts: React.ReactNode[] = [];
    const merged: [number, number][] = [];

    for (const [rawStart, rawEnd] of ranges) {
      const start = Math.max(0, rawStart);
      const end = Math.min(text.length - 1, rawEnd);
      if (start > end) continue;

      const last = merged[merged.length - 1];
      if (last && start <= last[1] + 1) {
        last[1] = Math.max(last[1], end);
      } else {
        merged.push([start, end]);
      }
    }

    let lastIndex = 0;
    merged.forEach(([start, end], index) => {
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }
      parts.push(
        <mark key={`${start}-${end}-${index}`} className="search-highlight">
          {text.slice(start, end + 1)}
        </mark>
      );
      lastIndex = end + 1;
    });

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  }

  function highlightMatch(
    text: string,
    matches: readonly FuseResultMatch[] | undefined,
    key: string,
    value?: string
  ): React.ReactNode {
    const match = matches?.find((m) => m.key === key && (!value || m.value === value));
    return highlightRanges(text, getRanges(match));
  }

  function buildContentSnippet(
    text: string,
    matches: readonly FuseResultMatch[] | undefined
  ): { prefix: string; suffix: string; text: string; ranges: [number, number][] } | null {
    const match = matches?.find((m) => m.key === "content");
    const ranges = getRanges(match);
    const firstRange = ranges[0];
    if (!firstRange) return null;

    const start = Math.max(0, firstRange[0] - SNIPPET_RADIUS);
    const end = Math.min(text.length, start + SNIPPET_LENGTH);
    const snippetText = text.slice(start, end).trim();
    const adjustedRanges = ranges
      .map(([rangeStart, rangeEnd]) => [rangeStart - start, rangeEnd - start] as [number, number])
      .filter(([rangeStart, rangeEnd]) => rangeEnd >= 0 && rangeStart < snippetText.length);

    return {
      prefix: start > 0 ? "…" : "",
      suffix: end < text.length ? "…" : "",
      text: snippetText,
      ranges: adjustedRanges,
    };
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          loadIndex();
          setOpen(true);
        }}
        className="search-trigger"
        aria-label={t("search.ariaLabel")}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? "search-dialog" : undefined}
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
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline">{t("search.label")}</span>
        <kbd className="search-kbd hidden sm:inline">⌘K</kbd>
      </button>

      {open && (
        <div
          className="search-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <div
            ref={modalRef}
            id="search-dialog"
            className="search-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("search.modalAria")}
            onKeyDown={handleDialogKeyDown}
          >
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
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder={t("search.placeholder")}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetActiveIndex();
                }}
                onKeyDown={handleInputKeyDown}
                autoComplete="off"
                role="combobox"
                aria-label={t("search.ariaLabel")}
                aria-autocomplete="list"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={activeResult ? `search-result-${activeResult.item.slug}` : undefined}
              />
              {loading && (
                <span className="search-loading" role="status" aria-live="polite">
                  {t("search.loading")}
                </span>
              )}
              <button
                type="button"
                className="search-close"
                onClick={closeSearch}
                aria-label={t("search.close")}
              >
                ×
              </button>
            </div>

            {loadError && (
              <div className="search-error" role="alert" aria-live="assertive">
                {t("search.error")}
                <button
                  type="button"
                  className="search-filter-clear"
                  onClick={() => {
                    setLoadError(false);
                    loadIndex();
                  }}
                >
                  {t("search.retry")}
                </button>
              </div>
            )}

            {(tagOptions.length > 0 || seriesOptions.length > 0) && (
              <div className="search-filters" role="group" aria-label={t("search.filters")}>
                <span className="search-filters-label" aria-hidden="true">
                  {t("search.filters")}
                </span>
                {tagOptions.length > 0 && (
                  <label className="search-filter-field">
                    <span className="sr-only">{t("search.filterTag")}</span>
                    <select
                      className="search-filter-select"
                      value={selectedTag}
                      onChange={(e) => {
                        setSelectedTag(e.target.value);
                        resetActiveIndex();
                      }}
                    >
                      <option value="">{t("search.allTags")}</option>
                      {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {seriesOptions.length > 0 && (
                  <label className="search-filter-field">
                    <span className="sr-only">{t("search.filterSeries")}</span>
                    <select
                      className="search-filter-select"
                      value={selectedSeries}
                      onChange={(e) => {
                        setSelectedSeries(e.target.value);
                        resetActiveIndex();
                      }}
                    >
                      <option value="">{t("search.allSeries")}</option>
                      {seriesOptions.map((series) => (
                        <option key={series} value={series}>
                          {series}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {hasFilters && (
                  <button
                    type="button"
                    className="search-filter-clear"
                    onClick={() => {
                      setSelectedTag("");
                      setSelectedSeries("");
                      resetActiveIndex();
                    }}
                  >
                    {t("search.clearFilters")}
                  </button>
                )}
              </div>
            )}

            {(trimmedQuery || hasFilters) && !loadError && (
              <div className="search-results">
                {results.length === 0 ? (
                  <div className="search-empty" role="status" aria-live="polite">
                    {loading ? t("search.loading") : t("search.empty")}
                  </div>
                ) : (
                  <ul ref={listRef} id="search-results" role="listbox" aria-label={t("search.modalAria")}>
                    {results.map((result, index) => {
                      const snippet = buildContentSnippet(result.item.content, result.matches);

                      return (
                        <li
                          id={`search-result-${result.item.slug}`}
                          key={result.item.slug}
                          role="option"
                          tabIndex={-1}
                          aria-selected={index === safeActiveIndex}
                          className={`search-result-item ${
                            index === safeActiveIndex ? "search-result-active" : ""
                          }`}
                          onClick={() => navigateTo(result.item.slug)}
                          onMouseEnter={() => setActiveIndex(index)}
                        >
                          <h4 className="search-result-title">
                            {highlightMatch(result.item.title, result.matches, "title")}
                          </h4>
                          <p className="search-result-summary">
                            {highlightMatch(result.item.summary, result.matches, "summary")}
                          </p>
                          {snippet && (
                            <p className="search-result-snippet">
                              {snippet.prefix}
                              {highlightRanges(snippet.text, snippet.ranges)}
                              {snippet.suffix}
                            </p>
                          )}
                          {(result.item.tags.length > 0 || result.item.series) && (
                            <div className="search-result-tags">
                              {result.item.series && (
                                <span className="search-result-tag search-result-tag--series">
                                  {t("search.seriesPrefix")}
                                  {highlightMatch(result.item.series, result.matches, "series")}
                                </span>
                              )}
                              {result.item.tags.map((tag) => (
                                <span key={tag} className="search-result-tag">
                                  {highlightMatch(tag, result.matches, "tags", tag)}
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            <div className="search-footer" aria-hidden="true">
              <span>
                <kbd className="search-kbd">↑↓</kbd> {t("search.move")}
              </span>
              <span>
                <kbd className="search-kbd">Enter</kbd> {t("search.goto")}
              </span>
              <span>
                <kbd className="search-kbd">Esc</kbd> {t("search.close")}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
