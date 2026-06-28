"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";

interface Props {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: "𝕏",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: "f",
    },
    {
      name: "Weibo",
      href: `https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`,
      icon: "微",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="share-section">
      <h3 className="share-title">{t("share.title")}</h3>
      <div className="share-buttons">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn"
            aria-label={`${t("share.shareTo")} ${link.name}`}
          >
            <span className="share-btn-icon">{link.icon}</span>
            <span className="share-btn-name">{link.name}</span>
          </a>
        ))}
        <button
          onClick={copyLink}
          className="share-btn share-btn--copy"
          aria-label={t("share.copyLink")}
        >
          <span className="share-btn-icon">🔗</span>
          <span className="share-btn-name">
            {copied ? t("share.copied") : t("share.copyLink")}
          </span>
        </button>
      </div>
    </div>
  );
}
