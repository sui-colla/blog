"use client";

import { useState, type FormEvent } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // 简单前端校验
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("请输入邮箱地址");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus("error");
      setMessage("邮箱格式不正确，请检查后再试");
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
        setMessage(data.message || "订阅成功！");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "订阅失败，请稍后再试");
      }
    } catch {
      setStatus("error");
      setMessage("网络出错了，请稍后再试");
    }
  }

  return (
    <div className="subscribe-box">
      <h3 className="subscribe-title">📬 订阅博客</h3>
      <p className="subscribe-desc">
        不想错过新文章？留下邮箱，有新内容时我会通知你。
      </p>

      <form className="subscribe-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="subscribe-input"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // 输入时清除错误/成功状态
            if (status === "error" || status === "success") {
              setStatus("idle");
              setMessage("");
            }
          }}
          disabled={status === "loading"}
          aria-label="邮箱地址"
        />
        <button
          type="submit"
          className="subscribe-btn"
          disabled={status === "loading"}
        >
          {status === "loading" ? "提交中..." : "订阅"}
        </button>
      </form>

      {/* 状态消息 */}
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
