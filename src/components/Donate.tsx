"use client";

/**
 * 赞赏支持组件
 *
 * 在文章底部展示微信和支付宝打赏入口。
 * 替换收款码：将图片放到 public/donate/ 目录即可自动加载：
 *   - public/donate/wechat.png  → 微信收款码
 *   - public/donate/alipay.png  → 支付宝收款码
 * 图片缺失时显示带指引的占位区域。
 */
import { useState, useCallback } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Donate() {
  const { t } = useI18n();
  const [showQR, setShowQR] = useState<"wechat" | "alipay" | null>(null);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const toggle = useCallback(
    (type: "wechat" | "alipay") =>
      setShowQR((prev) => (prev === type ? null : type)),
    []
  );

  const handleImgError = useCallback((type: string) => {
    setImgError((prev) => ({ ...prev, [type]: true }));
  }, []);

  const renderQR = (type: "wechat" | "alipay") => {
    const imgPath = `/donate/${type}.png`;
    const scanLabel =
      type === "wechat" ? t("donate.scanWechat") : t("donate.scanAlipay");
    const hasError = imgError[type];

    return (
      <div className="donate-qr">
        <p className="donate-qr-hint">{scanLabel}</p>

        {!hasError ? (
          <Image
            src={imgPath}
            alt={scanLabel}
            width={200}
            height={200}
            unoptimized
            onError={() => handleImgError(type)}
          />
        ) : (
          <div className="donate-qr-placeholder" aria-label={t("donate.qrPlaceholder")}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="3" height="3" />
              <line x1="21" y1="14" x2="21" y2="17" />
              <line x1="17" y1="21" x2="21" y2="21" />
            </svg>
            <span className="donate-qr-placeholder-text">
              {t("donate.qrPlaceholder")}
            </span>
            <span className="donate-qr-placeholder-hint">
              {t("donate.replaceHint")}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="donate-section" aria-labelledby="donate-heading">
      <h3 className="donate-title" id="donate-heading">
        {t("donate.title")}
      </h3>
      <p className="donate-desc">{t("donate.desc")}</p>

      <div className="donate-buttons">
        <button
          type="button"
          className="donate-btn donate-btn--wechat"
          onClick={() => toggle("wechat")}
          aria-expanded={showQR === "wechat"}
          aria-controls="donate-qr-panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.838-7.062-6.122zM14.84 13.19c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.97.983.976.976 0 0 1-.968-.983c0-.542.434-.982.969-.982z" />
          </svg>
          {t("donate.wechat")}
        </button>
        <button
          type="button"
          className="donate-btn donate-btn--alipay"
          onClick={() => toggle("alipay")}
          aria-expanded={showQR === "alipay"}
          aria-controls="donate-qr-panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.422 15.358c-1.366-.458-4.035-1.372-5.773-2.056a21.574 21.574 0 0 0 .615-1.632c.227-.666.435-1.391.562-2.145h-3.42v-1.29h4.14v-.885h-4.14V5.236h-1.932s-.025.17-.096.442c-.189.72-.536 1.51-.536 1.51v.165h-3.89v.885h3.89v1.29h-3.214v.885h6.435a17.888 17.888 0 0 1-.393 1.443 16.572 16.572 0 0 1-.483 1.307c-1.96-.686-3.81-1.195-4.68-1.195-2.548 0-4.107 1.443-4.107 3.027 0 2.543 2.997 3.343 5.568 3.343 2.028 0 4.247-.804 5.993-2.184 1.638 1.076 3.534 2.184 5.556 2.845A10.948 10.948 0 0 1 12 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12c0 1.196-.201 2.344-.566 3.415l-.512-.057zM9.09 17.55c-2.178 0-3.429-.654-3.429-1.791 0-.852.756-1.62 2.166-1.62 1.166 0 2.86.585 4.566 1.476-1.404 1.218-2.524 1.935-3.303 1.935z" />
          </svg>
          {t("donate.alipay")}
        </button>
      </div>

      {showQR && (
        <div id="donate-qr-panel" role="region" aria-label={showQR === "wechat" ? t("donate.scanWechat") : t("donate.scanAlipay")}>
          {renderQR(showQR)}
        </div>
      )}
    </section>
  );
}
