"use client";

/**
 * 评论区（基于 Giscus / GitHub Discussions）
 *
 * 关键设计：
 * - Giscus 组件延迟加载（mounted），避免 SSR 时水合不匹配
 * - 主题同步：监听 document.documentElement 的 data-theme 属性变化
 *   （MutationObserver）和 prefers-color-scheme 媒体查询，自动切换 Giscus 主题
 * - widgetKey 包含主题+语言+repoId，任一变化时强制重新挂载 Giscus iframe
 * - COMMENTS_READY_DELAY: 延迟显示骨架屏→真实组件的切换，避免 iframe 加载闪烁
 * - LOAD_ERROR_TIMEOUT: 超时检测，若 Giscus iframe 未在指定时间内加载完成则显示重新加载按钮
 * - 缺少配置时显示引导链接，指向 giscus.app 获取 repoId/categoryId
 *
 * 必需环境变量：NEXT_PUBLIC_GISCUS_REPO_ID、NEXT_PUBLIC_GISCUS_CATEGORY_ID
 */
import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

type WidgetTheme = "light" | "dark";

const COMMENTS_READY_DELAY = 900;
const LOAD_ERROR_TIMEOUT = 15_000;

function getSystemTheme(): WidgetTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveWidgetTheme(): WidgetTheme {
  if (typeof window === "undefined") return "light";

  const root = document.documentElement;
  const theme = root.getAttribute("data-theme");

  if (theme === "light" || theme === "dark") {
    return theme;
  }

  return getSystemTheme();
}

function CommentsSkeleton({ label }: { label: string }) {
  return (
    <div className="comments-loading-card" aria-hidden="true">
      <p className="comments-loading-label">{label}</p>
      <div className="skeleton skeleton-line skeleton-line--title comments-skeleton-line comments-skeleton-line--title" />
      <div className="skeleton skeleton-line comments-skeleton-line comments-skeleton-line--short" />
      <div className="skeleton skeleton-line comments-skeleton-line" />
      <div className="skeleton skeleton-line comments-skeleton-line comments-skeleton-line--medium" />
      <div className="comments-skeleton-panel skeleton" />
    </div>
  );
}

export default function Comments() {
  const { locale, t } = useI18n();
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID?.trim() ?? "";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID?.trim() ?? "";
  const hasConfig = Boolean(repoId && categoryId);
  const commentsLang = locale === "zh" ? "zh-CN" : "en";

  const [mounted, setMounted] = useState(false);
  const [widgetTheme, setWidgetTheme] = useState<WidgetTheme>("light");
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const mountedFrame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    const syncTheme = () => {
      setWidgetTheme(resolveWidgetTheme());
    };

    syncTheme();

    const root = document.documentElement;
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      if (!root.hasAttribute("data-theme")) {
        syncTheme();
      }
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleMediaChange);
    } else {
      media.addListener(handleMediaChange);
    }

    const readyTimer = window.setTimeout(() => {
      setIsReady(true);
    }, COMMENTS_READY_DELAY);

    // 超时检测：如果 Giscus iframe 在指定时间内未加载完成，显示重新加载按钮
    const errorTimer = window.setTimeout(() => {
      const iframe = document.querySelector("#comments iframe") as HTMLIFrameElement | null;
      if (!iframe) {
        setLoadError(true);
      }
    }, LOAD_ERROR_TIMEOUT);

    return () => {
      window.cancelAnimationFrame(mountedFrame);
      observer.disconnect();
      window.clearTimeout(readyTimer);
      window.clearTimeout(errorTimer);

      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", handleMediaChange);
      } else {
        media.removeListener(handleMediaChange);
      }
    };
  }, [reloadKey]);

  const handleReload = () => {
    setLoadError(false);
    setIsReady(false);
    setMounted(false);
    setReloadKey((k) => k + 1);
    window.requestAnimationFrame(() => {
      setMounted(true);
    });
    window.setTimeout(() => setIsReady(true), COMMENTS_READY_DELAY);
    window.setTimeout(() => {
      const iframe = document.querySelector("#comments iframe") as HTMLIFrameElement | null;
      if (!iframe) setLoadError(true);
    }, LOAD_ERROR_TIMEOUT);
  };

  if (!hasConfig) {
    return (
      <section className="comments-section">
        <div className="comments-header">
          <h3 className="comments-title">{t("comments.title")}</h3>
          <p className="comments-desc">{t("comments.desc")}</p>
        </div>
        <div className="comments-error-card" role="status" aria-live="polite">
          <h3 className="comments-error-title">{t("comments.missingTitle")}</h3>
          <p className="comments-error-desc">{t("comments.missingDesc")}</p>
          <p className="comments-setup-guide">
            <a
              href="https://giscus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="comments-setup-link"
            >
              {t("comments.setupGuide")}
            </a>
          </p>
        </div>
      </section>
    );
  }

  const widgetKey = `${widgetTheme}-${commentsLang}-${repoId}-${categoryId}-${reloadKey}`;

  return (
    <section className="comments-section" aria-busy={!isReady}>
      <div className="comments-header">
        <h3 className="comments-title">{t("comments.title")}</h3>
        <p className="comments-desc">{t("comments.desc")}</p>
      </div>

      <div className="comments-shell">
        <div
          className={`comments-loading-layer${isReady && !loadError ? " comments-loading-layer--hidden" : ""}`}
          aria-hidden={isReady && !loadError ? "true" : undefined}
        >
          <CommentsSkeleton label={t("comments.loading")} />
        </div>

        <div className={`comments-widget${isReady ? " comments-widget--ready" : " comments-widget--loading"}`}>
          {mounted && (
            <Giscus
              key={widgetKey}
              id="comments"
              repo="sui-colla/blog"
              repoId={repoId}
              category="Announcements"
              categoryId={categoryId}
              mapping="pathname"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme={widgetTheme}
              lang={commentsLang}
              loading="lazy"
            />
          )}
        </div>

        {loadError && (
          <div className="comments-load-error" role="alert" aria-live="assertive">
            <p className="comments-load-error-desc">{t("comments.loadErrorDesc")}</p>
            <button
              type="button"
              className="comments-reload-btn"
              onClick={handleReload}
              aria-label={t("comments.reload")}
            >
              {t("comments.reload")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
