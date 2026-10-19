"use client";

/**
 * 邮箱订阅表单（Fuwari 卡片风格）
 */
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
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

  const messageId = "subscribe-message";
  const hasError = status === "error" && Boolean(message);

  return (
    <section className="card-base section-card">
      <h2 className="section-title">{t("subscribe.title")}</h2>
      <p className="section-desc">{t("subscribe.desc")}</p>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <input
            type="email"
            className="form-input"
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
            aria-invalid={hasError || undefined}
            aria-describedby={message ? messageId : undefined}
            autoComplete="email"
            required
          />
        </div>
        <button
          type="submit"
          className="form-submit"
          disabled={status === "loading"}
          aria-busy={status === "loading" || undefined}
        >
          {status === "loading" ? t("subscribe.loading") : t("subscribe.btn")}
        </button>

        {message && (
          <p
            id={messageId}
            role="status"
            aria-live="polite"
            className={
              status === "success"
                ? "form-msg form-msg--success"
                : "form-msg form-msg--error"
            }
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
