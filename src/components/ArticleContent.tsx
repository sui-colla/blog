"use client";

import { useEffect, useRef } from "react";

interface Props {
  html: string;
}

export default function ArticleContent({ html }: Props) {
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
      btn.textContent = "复制";
      btn.setAttribute("aria-label", "复制代码");

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
          btn.textContent = "已复制!";
          btn.classList.add("copy-btn--success");
          setTimeout(() => {
            btn.textContent = "复制";
            btn.classList.remove("copy-btn--success");
          }, 2000);
        } catch {
          btn.textContent = "失败";
          setTimeout(() => {
            btn.textContent = "复制";
          }, 2000);
        }
      });

      pre.appendChild(btn);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
