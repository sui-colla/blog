"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";

function getSubscribeSuccessMessage(code: unknown, t: (key: string) => string) {
  if (code === "already_subscribed") return t("subscribe.already");
  return t("subscribe.success");
}

function getSubscribeErrorMessage(error: unknown, t: (key: string) => string) {
  if (error === "missing_fields") return t("subscribe.errorEmpty");
  if (error === "invalid_email") return t("subscribe.errorFormat");
  if (error === "email_too_long") return t("subscribe.errorTooLong");
  if (error === "service_unavailable" || error === "provider_error") {
    return t("subscribe.errorUnavailable");
  }
  return t("subscribe.errorFail");
}

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

      if (res.ok && data.ok) {
        setStatus("success");
        setMessage(getSubscribeSuccessMessage(data.code, t));
        setEmail("");
      } else {
        setStatus("error");
        setMessage(getSubscribeErrorMessage(data.error, t));
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
