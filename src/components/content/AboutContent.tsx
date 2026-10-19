"use client";

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import type { PostMeta } from "@/lib/content/posts";

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

interface Props {
  tags?: { tag: string; count: number }[];
  popularPosts?: PostMeta[];
}

export default function AboutContent({ tags = [], popularPosts = [] }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
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

  function clearStatusOnEdit() {
    if (status === "error" || status === "success") {
      setStatus("idle");
      setErrorMsg("");
    }
  }

  const messageId = "contact-form-message";
  const hasError = status === "error" && Boolean(errorMsg);
  const statusMessage =
    status === "success" ? t("contact.success") : hasError ? errorMsg : "";

  const morePages = [
    { href: "/projects", title: t("nav.projects"), desc: t("about.moreProjects") },
    { href: "/now", title: t("nav.now"), desc: t("about.moreNow") },
    { href: "/links", title: t("nav.links"), desc: t("about.moreLinks") },
    { href: "/uses", title: t("nav.uses"), desc: t("about.moreUses") },
  ];

  return (
    <PageShell tags={tags} popularPosts={popularPosts}>
      <div className="card-base content-card">
        <div className="markdown-body">
          <h1>{t("about.title")}</h1>
          <p>{t("about.intro")}</p>
          <p>{t("about.bio")}</p>
          <p>{t("about.contactDesc")}</p>
        </div>

        <h2 className="section-title" style={{ marginTop: "1.5rem" }}>
          {t("about.more")}
        </h2>
        <div className="card-grid card-grid--two">
          {morePages.map((item) => (
            <Link key={item.href} href={item.href} className="entry-card">
              <h3 className="entry-card__title">{item.title}</h3>
              <p className="entry-card__desc">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <section className="card-base section-card" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="section-title">
          {t("contact.title")}
        </h2>
        <p className="section-desc">{t("contact.desc")}</p>

        <form
          onSubmit={handleSubmit}
          className="form-card"
          noValidate
          aria-labelledby="contact-heading"
        >
          <div className="form-field">
            <label htmlFor="contact-name" className="form-label">
              {t("contact.name")}
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              className="form-input"
              placeholder={t("contact.namePlaceholder")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearStatusOnEdit();
              }}
              disabled={status === "loading"}
              aria-invalid={hasError || undefined}
              aria-describedby={statusMessage ? messageId : undefined}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-email" className="form-label">
              {t("contact.email")}
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              className="form-input"
              placeholder={t("contact.emailPlaceholder")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearStatusOnEdit();
              }}
              disabled={status === "loading"}
              aria-invalid={hasError || undefined}
              aria-describedby={statusMessage ? messageId : undefined}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="contact-message" className="form-label">
              {t("contact.message")}
            </label>
            <textarea
              id="contact-message"
              name="message"
              className="form-textarea"
              placeholder={t("contact.messagePlaceholder")}
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                clearStatusOnEdit();
              }}
              disabled={status === "loading"}
              aria-invalid={hasError || undefined}
              aria-describedby={statusMessage ? messageId : undefined}
              required
            />
          </div>

          <button
            type="submit"
            className="form-submit"
            disabled={status === "loading"}
            aria-busy={status === "loading" || undefined}
          >
            {status === "loading" ? t("contact.sending") : t("contact.submit")}
          </button>

          {statusMessage && (
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
              {statusMessage}
            </p>
          )}
        </form>
      </section>
    </PageShell>
  );
}
