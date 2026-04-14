"use client";

import { useEffect } from "react";

/**
 * Registers `public/sw.js` so repeat visits work offline (Cache API + same-origin assets).
 * LLM routes still hit `/api/*` when online; when offline the SW returns `skipped` so client fallbacks apply.
 */
export function OfflineServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "http:" && window.location.protocol !== "https:") return;

    /**
     * `next dev` + HMR often conflicts with a SW — enable in prod (`next start` / Vercel) by default.
     * To test the SW in dev: `NEXT_PUBLIC_OFFLINE_SW_DEV=1 npm run dev`
     */
    const enable =
      process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_OFFLINE_SW_DEV === "1";

    if (!enable) return;

    let cancelled = false;
    void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        if (cancelled) return;
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              void reg.update();
            }
          });
        });
      })
      .catch(() => {
        /* noop — e.g. blocked or unsupported */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
