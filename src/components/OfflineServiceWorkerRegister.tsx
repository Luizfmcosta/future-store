"use client";

import {
  applySwPrecacheMessage,
  requestPrecacheAuditFromSw,
  setPrecacheStatus,
} from "@/lib/precacheStatus";
import { useEffect } from "react";

/**
 * Registers `public/sw.js` so repeat visits work offline (Cache API + same-origin assets).
 * LLM routes still hit `/api/*` when online; when offline the SW returns `skipped` so client fallbacks apply.
 */
export function OfflineServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      setPrecacheStatus({ kind: "unsupported" });
      return;
    }
    if (window.location.protocol !== "http:" && window.location.protocol !== "https:") return;

    /**
     * `next dev` + HMR often conflicts with a SW — enable in prod (`next start` / Vercel) by default.
     * To test the SW in dev: `NEXT_PUBLIC_OFFLINE_SW_DEV=1 npm run dev`
     */
    const enable =
      process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_OFFLINE_SW_DEV === "1";

    if (!enable) {
      setPrecacheStatus({ kind: "disabled" });
      return;
    }

    function onMessage(ev: MessageEvent) {
      applySwPrecacheMessage(ev.data);
    }
    navigator.serviceWorker.addEventListener("message", onMessage);

    function onControllerChange() {
      if (navigator.serviceWorker.controller) {
        requestPrecacheAuditFromSw();
      } else {
        setPrecacheStatus({ kind: "starting" });
      }
    }
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    let cancelled = false;
    let pollId: ReturnType<typeof setTimeout> | undefined;

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
        if (navigator.serviceWorker.controller) {
          requestPrecacheAuditFromSw();
        } else {
          setPrecacheStatus({ kind: "starting" });
          pollId = setTimeout(() => {
            if (!cancelled) requestPrecacheAuditFromSw();
          }, 2500);
        }
      })
      .catch(() => {
        setPrecacheStatus({ kind: "error" });
      });

    return () => {
      cancelled = true;
      if (pollId) clearTimeout(pollId);
      navigator.serviceWorker.removeEventListener("message", onMessage);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  return null;
}
