"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function Donate() {
  const { locale } = useI18n();
  const [showQR, setShowQR] = useState<"wechat" | "alipay" | null>(null);

  return (
    <section className="donate-section">
      <h3 className="donate-title">
        {locale === "zh" ? "☕ 赞赏支持" : "☕ Support"}
      </h3>
      <p className="donate-desc">
        {locale === "zh"
          ? "如果这篇文章对你有帮助，可以请作者喝杯咖啡~"
          : "If this article helped you, consider buying the author a coffee~"}
      </p>

      <div className="donate-buttons">
        <button
          className="donate-btn donate-btn--wechat"
          onClick={() => setShowQR(showQR === "wechat" ? null : "wechat")}
        >
          💚 {locale === "zh" ? "微信" : "WeChat"}
        </button>
        <button
          className="donate-btn donate-btn--alipay"
          onClick={() => setShowQR(showQR === "alipay" ? null : "alipay")}
        >
          💙 {locale === "zh" ? "支付宝" : "Alipay"}
        </button>
      </div>

      {showQR && (
        <div className="donate-qr">
          {/* TODO: 替换为实际的收款码图片 */}
          <div className="inline-block p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {showQR === "wechat"
                ? locale === "zh"
                  ? "请打开微信扫一扫"
                  : "Open WeChat to scan"
                : locale === "zh"
                  ? "请打开支付宝扫一扫"
                  : "Open Alipay to scan"}
            </p>
            <div className="mt-2 w-48 h-48 bg-zinc-100 dark:bg-zinc-700 rounded flex items-center justify-center text-zinc-400 text-sm">
              {locale === "zh" ? "收款码占位" : "QR Code Placeholder"}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
