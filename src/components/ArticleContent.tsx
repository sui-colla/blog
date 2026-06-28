"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

interface Props {
  html: string;
}

export default function ArticleContent({ html }: Props) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
  }, [html, t]);

  return (
    <div
      ref={ref}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
