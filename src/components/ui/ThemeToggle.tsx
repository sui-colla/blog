"use client";

/**
 * 主题切换按钮（dark ↔ light）
 *
 * - 默认黑色水晶暗色主题；偏好持久化到 localStorage("theme")
 * - 不再使用 system：系统亮色不应该把站点从黑色水晶带回白底
 * - light 作为显式可选项保留，方便需要高对比阅读时切换
 * - 未 mounted 时渲染空占位符，防止 SSR 水合不匹配
 */
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("theme") === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export default function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // 初始化：从 localStorage 读取并应用
  useEffect(() => {
    const stored = getStoredTheme();
    // 主题本身在这里同步应用，不受影响；
    // 但 setMounted 用 setTimeout 而非 rAF —— rAF 在页面不可见时不触发，
    // 那样后台标签页里切换按钮会一直停在未挂载状态。
    applyTheme(stored);
    setTimeout(() => {
      setTheme(stored);
      setMounted(true);
    }, 0);
  }, []);

  // 切换主题
  function cycleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("theme", next);
  }

  // 防止 SSR 水合不匹配
  if (!mounted) {
    return <span className="icon-btn" />;
  }

  const icons: Record<Theme, React.ReactNode> = {
    light: <Sun size={16} aria-hidden="true" />,
    dark: <Moon size={16} aria-hidden="true" />,
  };

  const labels: Record<Theme, string> = {
    light: t("theme.light"),
    dark: t("theme.dark"),
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="btn-plain icon-btn"
      title={labels[theme]}
      aria-label={`${t("theme.ariaPrefix")}${labels[theme]}${t("theme.ariaSuffix")}`}
    >
      {icons[theme]}
    </button>
  );
}
