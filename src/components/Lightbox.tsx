"use client";

/**
 * 图片灯箱（Lightbox）
 *
 * 使用 createPortal 将灯箱渲染到 document.body，脱离父组件的 overflow:hidden 约束。
 * 支持键盘导航：← → 切换图片，Esc 关闭，Tab 在灯箱控件间循环。
 * 打开时锁定 body 滚动，关闭后恢复。
 */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useCallback, useState, useRef } from "react";
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      setMounted(true);
      closeBtnRef.current?.focus();
    });
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
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
      if (e.key === "Tab" && overlayRef.current) {
        const focusable = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext]);

  if (!mounted) return null;

  const current = images[index];
  const hasMultiple = images.length > 1;
  const caption = current.caption || current.alt;
  const dialogLabel = caption || t("lightbox.zoom");

  return createPortal(
    <div
      ref={overlayRef}
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={dialogLabel}
    >
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={current.src} alt={current.alt || caption || t("lightbox.zoom")} />
        {caption && <p className="lightbox-caption" id="lightbox-caption">{caption}</p>}
      </div>

      {/* 关闭按钮 */}
      <button
        ref={closeBtnRef}
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label={t("lightbox.close")}
      >
        <span aria-hidden="true">✕</span>
      </button>

      {/* 导航按钮 */}
      {hasMultiple && (
        <>
          <button
            type="button"
            className="lightbox-nav lightbox-nav--prev"
            onClick={goPrev}
            aria-label={t("lightbox.prev")}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-nav--next"
            onClick={goNext}
            aria-label={t("lightbox.next")}
          >
            <span aria-hidden="true">›</span>
          </button>
          <div className="lightbox-counter" aria-live="polite" aria-atomic="true">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>,
    document.body
  );
}
