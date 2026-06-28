"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-orange-500 hover:bg-orange-50 dark:text-zinc-400 dark:hover:text-orange-400 dark:hover:bg-zinc-800 transition-colors text-xs font-bold"
      title={locale === "zh" ? "Switch to English" : "切换到中文"}
      aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
    >
      {locale === "zh" ? "EN" : "中"}
    </button>
  );
}
