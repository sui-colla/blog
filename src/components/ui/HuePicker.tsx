"use client";

/**
 * 主题色相选择（对应 Fuwari DisplaySettings 中的主题色滑块）
 *
 * 只改 --hue 一个变量，整站 oklch 色板随之变化；偏好写入 localStorage。
 */
import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const PRESETS = [0, 30, 60, 120, 180, 210, 250, 300, 345];

function applyHue(hue: number) {
  document.documentElement.style.setProperty("--hue", String(hue));
}

export default function HuePicker() {
  const { t } = useI18n();
  const [hue, setHue] = useState(250);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("hue");
    const parsed = raw === null ? Number.NaN : Number(raw);
    const initial =
      Number.isFinite(parsed) && parsed >= 0 && parsed <= 360 ? parsed : 250;
    applyHue(initial);
    // 异步同步到 state，避免 effect 内同步 setState 触发级联渲染
    const timer = window.setTimeout(() => setHue(initial), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const update = (value: number) => {
    setHue(value);
    applyHue(value);
    localStorage.setItem("hue", String(value));
  };

  return (
    <div className="hue-picker" ref={wrapRef}>
      <button
        type="button"
        className="btn-plain icon-btn"
        onClick={() => setOpen((value) => !value)}
        aria-label={t("theme.hue")}
        title={t("theme.hue")}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Palette size={20} aria-hidden="true" />
      </button>

      {open && (
        <div className="hue-panel" role="dialog" aria-label={t("theme.hue")}>
          <p className="hue-panel__label">{t("theme.hue")}</p>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={hue}
            onChange={(event) => update(Number(event.target.value))}
            className="hue-range"
            aria-label={t("theme.hue")}
          />
          <div className="hue-swatches">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`hue-swatch${hue === preset ? " is-active" : ""}`}
                style={{ background: `oklch(0.7 0.14 ${preset})` }}
                onClick={() => update(preset)}
                aria-label={`${t("theme.hue")} ${preset}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
