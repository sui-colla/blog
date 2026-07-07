"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/lib/i18n";

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface Props {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: Props) {
  const { t } = useI18n();
  const [index, setIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setMounted(true));
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext]);

  if (!mounted) return null;

  const current = images[index];
  const hasMultiple = images.length > 1;
  const caption = current.caption || current.alt;

  return createPortal(
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={caption || t("lightbox.zoom")}
    >
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={current.src} alt={current.alt} />
        {caption && <p className="lightbox-caption">{caption}</p>}
      </div>

      {/* 关闭按钮 */}
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label={t("lightbox.close")}
      >
        ✕
      </button>

      {/* 导航按钮 */}
      {hasMultiple && (
        <>
          <button
            className="lightbox-nav lightbox-nav--prev"
            onClick={goPrev}
            aria-label={t("lightbox.prev")}
          >
            ‹
          </button>
          <button
            className="lightbox-nav lightbox-nav--next"
            onClick={goNext}
            aria-label={t("lightbox.next")}
          >
            ›
          </button>
          <div className="lightbox-counter">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>,
    document.body
  );
}
