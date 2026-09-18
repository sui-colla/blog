"use client";

/**
 * 客户端国际化（i18n）
 *
 * 架构要点：
 * - 仅客户端渲染，服务端默认输出中文（避免 SSR/CSR 水合不匹配）
 * - 语言偏好持久化到 localStorage，切换时同步更新 <html lang="...">
 * - 翻译字典按语言拆到 zh.ts / en.ts，用 t("section.key") 调用
 * - I18nProvider 必须在布局顶层包裹，所有客户端组件通过 useI18n() 消费
 *
 * ⚠️ 已知限制：语言偏好只存在浏览器本地，服务端读不到，因此所有
 *    服务端渲染的产物都固定为中文 —— 各页 metadata、RSS、sitemap、OG 图。
 *    这也是 layout 固定渲染 lang="zh-CN"、需要客户端纠正的原因。
 *    要根治需把 locale 放进 URL 段或 cookie。
 */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import zh from "./zh";
import en from "./en";

type Locale = "zh" | "en";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = { zh, en };

const I18nContext = createContext<I18nContextValue | null>(null);

/** 语言 → <html lang> 的值。服务端 layout 固定渲染 zh-CN，客户端负责纠正 */
const LANG_ATTR: Record<Locale, string> = { zh: "zh-CN", en: "en" };

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    requestAnimationFrame(() => {
      if (stored === "zh" || stored === "en") {
        setLocaleState(stored);
      }
      setMounted(true);
    });
  }, []);

  // 同步 <html lang>。必须放在 effect 里而不是只写在 setLocale 中：
  // 语言偏好是持久化的，刷新后走的是上面「从 localStorage 恢复」这条路径，
  // 不会经过 setLocale。少了这一条，英文界面会顶着 lang="zh-CN"，
  // 读屏软件按中文发音，搜索引擎也会拿到错误的语言信号。
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = LANG_ATTR[locale];
  }, [locale, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale] ?? translations.zh;
      return dict[key] ?? key;
    },
    [locale]
  );

  // 防止水合不匹配
  if (!mounted) {
    const tServer = (key: string) => translations.zh[key] ?? key;
    return (
      <I18nContext.Provider value={{ locale: "zh", setLocale, t: tServer }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
