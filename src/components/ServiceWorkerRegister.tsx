"use client";

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
