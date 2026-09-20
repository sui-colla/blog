"use client";

/**
 * 跳过导航链接 - 无障碍
 * 客户端组件，以便根据当前语言输出文案。
 */
import { useI18n } from "@/lib/i18n";

export default function SkipToContent() {
  const { t } = useI18n();

  return (
    <a href="#main-content" className="skip-to-content">
      {t("a11y.skipToContent")}
    </a>
  );
}
