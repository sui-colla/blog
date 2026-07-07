"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";

function getContactErrorMessage(error: unknown, t: (key: string) => string) {
  if (error === "missing_fields") return t("contact.errorEmpty");
  if (error === "invalid_email") return t("contact.errorEmail");
  if (
    error === "name_too_long" ||
    error === "email_too_long" ||
    error === "message_too_long"
  ) {
    return t("contact.errorTooLong");
  }
  if (error === "service_unavailable" || error === "provider_error") {
    return t("contact.errorUnavailable");
  }
  return t("contact.errorFail");
}

export default function AboutContent() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg(t("contact.errorEmpty"));
      setStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg(t("contact.errorEmail"));
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMsg(getContactErrorMessage(data.error, t));
        setStatus("error");
      }
    } catch {
      setErrorMsg(t("contact.errorNetwork"));
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-orange-500 transition-colors mb-8"
      >
        &larr; {t("post.backHome")}
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
          {t("about.title")}
        </span>
      </h1>
      <div className="prose max-w-none mt-8">
        <p>{t("about.intro")}</p>
        <p>{t("about.bio")}</p>
        <h2>{t("about.contact")}</h2>
        <p>{t("about.contactDesc")}</p>
      </div>

      {/* 联系表单 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
          {t("contact.title")}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          {t("contact.desc")}
        </p>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-field">
            <label htmlFor="contact-name" className="contact-label">
              {t("contact.name")}
            </label>
            <input
              id="contact-name"
              type="text"
              className="contact-input"
              placeholder={t("contact.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-email" className="contact-label">
              {t("contact.email")}
            </label>
            <input
              id="contact-email"
              type="email"
              className="contact-input"
              placeholder={t("contact.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-message" className="contact-label">
              {t("contact.message")}
            </label>
            <textarea
              id="contact-message"
              className="contact-textarea"
              placeholder={t("contact.messagePlaceholder")}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
          <button
            type="submit"
            className="contact-btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? t("contact.sending") : t("contact.submit")}
          </button>
          {status === "success" && (
            <p className="contact-msg contact-msg--success">
              {t("contact.success")}
            </p>
          )}
          {status === "error" && errorMsg && (
            <p className="contact-msg contact-msg--error">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
