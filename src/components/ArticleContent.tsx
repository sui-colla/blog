"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import Lightbox from "@/components/Lightbox";

interface Props {
  html: string;
}

interface LightboxImage {
  src: string;
  alt: string;
}

export default function ArticleContent({ html }: Props) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null);

  const openLightbox = useCallback((images: LightboxImage[], index: number) => {
    setLightbox({ images, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 复制按钮
    const pres = el.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = t("copy.btn");
      btn.setAttribute("aria-label", t("copy.ariaLabel"));

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
          btn.textContent = t("copy.success");
          btn.classList.add("copy-btn--success");
          setTimeout(() => {
            btn.textContent = t("copy.btn");
            btn.classList.remove("copy-btn--success");
          }, 2000);
        } catch {
          btn.textContent = t("copy.fail");
          setTimeout(() => {
            btn.textContent = t("copy.btn");
          }, 2000);
        }
      });

      pre.appendChild(btn);
    });

    // 图片灯箱
    const imgs = Array.from(el.querySelectorAll("img"));
    const imageData: LightboxImage[] = imgs.map((img) => ({
      src: (img as HTMLImageElement).src,
      alt: img.alt || "",
    }));

    imgs.forEach((img, idx) => {
      const handler = () => openLightbox(imageData, idx);
      img.addEventListener("click", handler);
      // 清理函数存储在元素上
      (img as HTMLImageElement & { _lightboxCleanup?: () => void })._lightboxCleanup = () => {
        img.removeEventListener("click", handler);
      };
    });

    return () => {
      imgs.forEach((img) => {
        const cleanup = (img as HTMLImageElement & { _lightboxCleanup?: () => void })._lightboxCleanup;
        cleanup?.();
      });
    };
  }, [html, t, openLightbox]);

  return (
    <>
      <div
        ref={ref}
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
