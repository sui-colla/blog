"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";

interface Props {
  title: string;
  url: string;
}

/* SVG icon components — small, inline, no external deps */
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WeiboIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM20.196 9.4a4.83 4.83 0 0 0-5.543-1.404l-.396.147-.18-.399a4.82 4.82 0 0 0-1.872-2.1l-.347-.199.203-.34a3.065 3.065 0 0 1 3.495-1.37 3.07 3.07 0 0 1 2.084 3.794l-.098.381.389.093a3.069 3.069 0 0 1 2.273 3.574l-.106.384-.39-.097A4.82 4.82 0 0 0 20.196 9.4zm2.164-5.463A6.868 6.868 0 0 0 16.606.54l-.703-.084.076-.69a2.143 2.143 0 0 1 2.475-1.87A2.133 2.133 0 0 1 20.1.473a2.15 2.15 0 0 1 .754 1.623l-.006.224-.22.023a6.842 6.842 0 0 0 1.732 1.594z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
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
      icon: <XIcon />,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon />,
    },
    {
      name: "Weibo",
      href: `https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`,
      icon: <WeiboIcon />,
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
          type="button"
          onClick={copyLink}
          className={`share-btn share-btn--copy${copied ? " share-btn--copied" : ""}`}
          aria-label={t("share.copyLink")}
          aria-live="polite"
        >
          <span className="share-btn-icon">
            {copied ? <CheckIcon /> : <LinkIcon />}
          </span>
          <span className="share-btn-name">
            {copied ? t("share.copied") : t("share.copyLink")}
          </span>
        </button>
      </div>
    </div>
  );
}
