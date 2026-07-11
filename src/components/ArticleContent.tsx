"use client";

/**
 * 文章正文渲染器
 *
 * 职责：
 * 1. 通过 dangerouslySetInnerHTML 注入服务端渲染好的 HTML
 * 2. 客户端增强：为代码块注入「复制」按钮（rehype 插件只生成容器结构）
 * 3. 为所有 <img> 绑定点击事件 → 打开 Lightbox 灯箱查看大图
 *
 * 为什么不在服务端完成复制按钮？
 * clipboard API 和事件监听只能在客户端运行，所以这里用 useEffect 做 DOM 增强。
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import Lightbox from "@/components/Lightbox";

interface Props {
  html: string;
}

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

type EnhancedImage = HTMLImageElement & { _lightboxCleanup?: () => void };

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

    const codeBlocks = Array.from(el.querySelectorAll<HTMLElement>(".code-block"));
    const enhancedPres = new Set<HTMLPreElement>();

    codeBlocks.forEach((block) => {
      const pre = block.querySelector("pre");
      const code = pre?.querySelector("code");
      if (!pre || !code || block.querySelector(".copy-btn")) return;

      enhancedPres.add(pre);
      const actions = block.querySelector(".code-block-actions") ?? block;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = t("copy.btn");
      btn.setAttribute("aria-label", t("copy.ariaLabel"));
      btn.setAttribute("aria-live", "polite");

      btn.addEventListener("click", async () => {
        btn.textContent = t("copy.copying");
        btn.classList.remove("copy-btn--success", "copy-btn--error");
        btn.classList.add("copy-btn--loading");

        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
          btn.textContent = t("copy.success");
          btn.classList.remove("copy-btn--loading");
          btn.classList.add("copy-btn--success");
          setTimeout(() => {
            btn.textContent = t("copy.btn");
            btn.classList.remove("copy-btn--success");
          }, 2000);
        } catch {
          btn.textContent = t("copy.fail");
          btn.classList.remove("copy-btn--loading");
          btn.classList.add("copy-btn--error");
          setTimeout(() => {
            btn.textContent = t("copy.btn");
            btn.classList.remove("copy-btn--error");
          }, 2000);
        }
      });

      actions.appendChild(btn);
    });

    const pres = el.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (enhancedPres.has(pre) || pre.querySelector(".copy-btn")) return;

      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = t("copy.btn");
      btn.setAttribute("aria-label", t("copy.ariaLabel"));
      btn.setAttribute("aria-live", "polite");

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        if (!code) return;

        btn.textContent = t("copy.copying");
        btn.classList.remove("copy-btn--success", "copy-btn--error");
        btn.classList.add("copy-btn--loading");

        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
          btn.textContent = t("copy.success");
          btn.classList.remove("copy-btn--loading");
          btn.classList.add("copy-btn--success");
          setTimeout(() => {
            btn.textContent = t("copy.btn");
            btn.classList.remove("copy-btn--success");
          }, 2000);
        } catch {
          btn.textContent = t("copy.fail");
          btn.classList.remove("copy-btn--loading");
          btn.classList.add("copy-btn--error");
          setTimeout(() => {
            btn.textContent = t("copy.btn");
            btn.classList.remove("copy-btn--error");
          }, 2000);
        }
      });

      pre.appendChild(btn);
    });

    const imgs = Array.from(el.querySelectorAll("img"));
    const imageData: LightboxImage[] = imgs.map((img) => {
      const figure = img.closest("figure");
      const caption = figure?.querySelector("figcaption")?.textContent?.trim();
      return {
        src: (img as HTMLImageElement).src,
        alt: img.alt || "",
        caption: caption || undefined,
      };
    });

    imgs.forEach((img, idx) => {
      const enhanced = img as EnhancedImage;
      const handler = () => openLightbox(imageData, idx);
      const keyHandler = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handler();
        }
      };

      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute(
        "aria-label",
        `${t("lightbox.zoom")}: ${img.alt || imageData[idx].caption || t("lightbox.zoom")}`
      );
      img.addEventListener("click", handler);
      img.addEventListener("keydown", keyHandler);
      enhanced._lightboxCleanup = () => {
        img.removeEventListener("click", handler);
        img.removeEventListener("keydown", keyHandler);
      };
    });

    return () => {
      imgs.forEach((img) => {
        const cleanup = (img as EnhancedImage)._lightboxCleanup;
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
