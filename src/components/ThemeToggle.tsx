"use client";

/**
 * 主题切换按钮（system → light → dark → system 循环切换）
 *
 * - 偏好持久化到 localStorage("theme")
 * - "system" 模式移除 data-theme 属性，让 CSS 的 prefers-color-scheme 媒体查询生效
 * - "light"/"dark" 模式显式设置 data-theme，覆盖系统偏好
 * - 未 mounted 时渲染空占位符，防止 SSR 水合不匹配
 */
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

type Theme = "system" | "light" | "dark";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

export default function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  // 初始化：从 localStorage 读取并应用
  useEffect(() => {
    const stored = getStoredTheme();
    applyTheme(stored);
    requestAnimationFrame(() => {
      setTheme(stored);
      setMounted(true);
    });
  }, []);

  // 切换主题
  function cycleTheme() {
    const next: Theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
  }

  // 防止 SSR 水合不匹配
  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const icons: Record<Theme, React.ReactNode> = {
    system: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    light: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    ),
    dark: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  };

  const labels: Record<Theme, string> = {
    system: t("theme.system"),
    light: t("theme.light"),
    dark: t("theme.dark"),
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-orange-500 hover:bg-orange-50 dark:text-zinc-400 dark:hover:text-orange-400 dark:hover:bg-zinc-800 transition-colors"
      title={labels[theme]}
      aria-label={`${t("theme.ariaPrefix")}${labels[theme]}${t("theme.ariaSuffix")}`}
    >
      {icons[theme]}
    </button>
  );
}
