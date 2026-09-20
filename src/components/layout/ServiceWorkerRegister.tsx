"use client";

/**
 * Service Worker 注册器
 *
 * 仅在生产环境注册 /sw.js，为 PWA 提供离线缓存能力。
 * 开发环境跳过，避免缓存干扰热更新。
 */
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Service worker registration failed", error);
      }
    });
  }, []);

  return null;
}
