"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";

export default function Subscribe() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage(t("subscribe.errorEmpty"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus("error");
      setMessage(t("subscribe.errorFormat"));
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || t("subscribe.success"));
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || t("subscribe.errorFail"));
      }
    } catch {
      setStatus("error");
      setMessage(t("subscribe.errorNetwork"));
    }
  }

  return (
    <div className="subscribe-box">
      <h3 className="subscribe-title">{t("subscribe.title")}</h3>
      <p className="subscribe-desc">{t("subscribe.desc")}</p>

      <form className="subscribe-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="subscribe-input"
          placeholder={t("subscribe.placeholder")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error" || status === "success") {
              setStatus("idle");
              setMessage("");
            }
          }}
          disabled={status === "loading"}
          aria-label={t("subscribe.ariaLabel")}
        />
        <button
          type="submit"
          className="subscribe-btn"
          disabled={status === "loading"}
        >
          {status === "loading" ? t("subscribe.loading") : t("subscribe.btn")}
        </button>
      </form>

      {message && (
        <p
          className={
            status === "success"
              ? "subscribe-msg subscribe-msg--success"
              : "subscribe-msg subscribe-msg--error"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
