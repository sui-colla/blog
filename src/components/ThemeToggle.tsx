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
import { Laptop, Moon, Sun } from "lucide-react";
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
    system: <Laptop size={16} aria-hidden="true" />,
    light: <Sun size={16} aria-hidden="true" />,
    dark: <Moon size={16} aria-hidden="true" />,
  };

  const labels: Record<Theme, string> = {
    system: t("theme.system"),
    light: t("theme.light"),
    dark: t("theme.dark"),
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="icon-button"
      title={labels[theme]}
      aria-label={`${t("theme.ariaPrefix")}${labels[theme]}${t("theme.ariaSuffix")}`}
    >
      {icons[theme]}
    </button>
  );
}
