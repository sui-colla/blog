"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type Fuse from "fuse.js";
import type { FuseResult, FuseResultMatch } from "fuse.js";
import { useI18n } from "@/lib/i18n";

interface SearchItem {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
}

export default function Search() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo<FuseResult<SearchItem>[]>(() => {
    if (!fuse || !query.trim()) return [];
    return fuse.search(query.trim());
  }, [query, fuse]);
  const safeActiveIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const activeResult = results[safeActiveIndex];

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const loadIndex = useCallback(async () => {
    if (fuse) return;
    setLoading(true);
    try {
      const [{ default: FuseConstructor }, res] = await Promise.all([
        import("fuse.js"),
        fetch("/api/search-index"),
      ]);
      const items: SearchItem[] = await res.json();
      const instance = new FuseConstructor(items, {
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
      // silent
    } finally {
      setLoading(false);
    }
  }, [fuse]);

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
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled"));

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

  function highlightMatch(
    text: string,
    matches: readonly FuseResultMatch[] | undefined,
    key: string
  ): React.ReactNode {
    const match = matches?.find((m) => m.key === key);
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
      <button
        onClick={() => {
          loadIndex();
          setOpen(true);
        }}
        className="search-trigger"
        aria-label={t("search.ariaLabel")}
        aria-expanded={open}
        aria-haspopup="dialog"
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
                type="text"
                className="search-input"
                placeholder={t("search.placeholder")}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                autoComplete="off"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={activeResult ? `search-result-${activeResult.item.slug}` : undefined}
              />
              {loading && <span className="search-loading">{t("search.loading")}</span>}
            </div>

            {query.trim() && (
              <div className="search-results">
                {results.length === 0 ? (
                  <div className="search-empty">{t("search.empty")}</div>
                ) : (
                  <ul ref={listRef} id="search-results" role="listbox">
                    {results.map((result, index) => (
                      <li
                        id={`search-result-${result.item.slug}`}
                        key={result.item.slug}
                        role="option"
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

            <div className="search-footer">
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
