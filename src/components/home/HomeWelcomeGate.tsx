"use client";

/* eslint-disable react-hooks/set-state-in-effect -- portal host resolution + gate visibility synced to pathname / reset nonce */
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const WELCOME_SESSION_KEY = "fs-home-welcome-dismissed";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Logo + Start na primeira visita a `/` (navegação normal). Refresh não reabre o gate; só o botão Reset reabre.
 * SPA de volta à home não mostra o gate. Start seleciona Marina, expande o cluster de perfil e rola o `main` ao topo (hero).
 */
export function HomeWelcomeGate() {
  const t = useT();
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const lastHandledResetNonceRef = useRef(0);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [startLocked, setStartLocked] = useState(false);
  const reduceMotion = useReducedMotion();

  const setProfile = useDemoStore((s) => s.setProfile);
  const setUiLocale = useDemoStore((s) => s.setUiLocale);
  const uiLocale = useDemoStore((s) => s.uiLocale);
  const requestProfileClusterExpand = useDemoStore((s) => s.requestProfileClusterExpand);
  const requestHomeScrollToTop = useDemoStore((s) => s.requestHomeScrollToTop);
  const resetNonce = useDemoStore((s) => s.homeWelcomeResetNonce);

  const exitMs = reduceMotion ? 0.18 : 0.52;
  const enterMs = reduceMotion ? 0.15 : 0.42;

  useLayoutEffect(() => {
    setHost(document.querySelector<HTMLElement>("[data-storefront-window]"));
  }, []);

  useEffect(() => {
    if (showGate) setStartLocked(false);
  }, [showGate]);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    if (pathname !== "/") {
      setShowGate(false);
      return;
    }

    if (prev !== null && prev !== "/") {
      setShowGate(false);
      return;
    }

    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "reload") {
        setShowGate(false);
        return;
      }
    } catch {
      /* noop */
    }

    try {
      if (sessionStorage.getItem(WELCOME_SESSION_KEY) === "1") {
        setShowGate(false);
        return;
      }
    } catch {
      /* private mode — show gate once */
    }

    setShowGate(true);
  }, [pathname]);

  /** Reset control: show gate only for a new nonce once `pathname` is `/` (handles PDP → `/` after `router.push`). */
  useEffect(() => {
    if (resetNonce === 0) return;
    if (pathname !== "/") return;
    if (resetNonce === lastHandledResetNonceRef.current) return;
    lastHandledResetNonceRef.current = resetNonce;
    try {
      sessionStorage.removeItem(WELCOME_SESSION_KEY);
    } catch {
      /* private mode */
    }
    setShowGate(true);
  }, [resetNonce, pathname]);

  const handleStart = () => {
    if (startLocked) return;
    setStartLocked(true);
    setProfile("marina");
    requestProfileClusterExpand();
    try {
      sessionStorage.setItem(WELCOME_SESSION_KEY, "1");
    } catch {
      /* private mode */
    }
    setShowGate(false);
    /** `StorefrontMain` applies scroll in `useLayoutEffect` after commit (reliable vs timers). */
    requestHomeScrollToTop();
  };

  if (!host) return null;

  return createPortal(
    <AnimatePresence
      mode="sync"
      onExitComplete={() => {
        requestHomeScrollToTop();
      }}
    >
      {showGate ? (
        <motion.div
          key="fs-home-welcome"
          className="pointer-events-auto absolute inset-0 z-[250] flex flex-col items-stretch justify-center rounded-[inherit] bg-[#0c0c0c]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-welcome-title"
          aria-describedby="home-welcome-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.992 }}
          transition={{
            duration: exitMs,
            ease,
            opacity: { duration: exitMs, ease },
          }}
        >
          <h2 id="home-welcome-title" className="sr-only">
            {t("homeWelcome.title")}
          </h2>
          <motion.div
            className="flex min-h-0 flex-1 flex-col items-center justify-center gap-10 px-6 pb-24 sm:pb-28"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: enterMs, delay: reduceMotion ? 0 : 0.06, ease }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/branding/fs-reduced.svg" alt="" className="h-16 w-auto opacity-90 sm:h-20" />
            <div className="flex flex-col items-center gap-5">
              <p
                id="home-welcome-tagline"
                className="max-w-[min(24rem,calc(100vw-3rem))] text-center text-[17px] font-normal leading-[1.55] tracking-tight text-white/[0.72] sm:text-[18px] sm:leading-[1.6]"
              >
                {t("homeWelcome.tagline")}
              </p>
              <button
                type="button"
                onClick={handleStart}
                disabled={startLocked}
                className={cn(
                  ui.floatingChrome.segmentFocus,
                  ui.glassChrome.clusterShell,
                  "min-w-[8.5rem] rounded-full px-9 py-3.5 text-[16px] font-semibold tracking-tight text-white transition hover:bg-white/[0.06] sm:text-[17px]",
                  startLocked && "pointer-events-none opacity-70",
                )}
              >
                {t("homeWelcome.start")}
              </button>
            </div>
          </motion.div>
          <div className="pointer-events-auto absolute inset-x-0 bottom-6 flex justify-center px-6 sm:bottom-8">
            <div
              role="group"
              aria-label={t("homeWelcome.languageGroupAria")}
              className={cn(
                ui.floatingChrome.segmentFocus,
                "inline-flex items-center gap-0.5 rounded-full border border-white/[0.12] bg-black/30 p-0.5 text-[13px] text-white/80 backdrop-blur-sm sm:text-[14px]",
              )}
            >
              <button
                type="button"
                onClick={() => setUiLocale("en")}
                className={cn(
                  "rounded-full px-3 py-1.5 font-medium transition sm:px-3.5",
                  uiLocale === "en" ? "bg-white/[0.14] text-white" : "text-white/55 hover:text-white/85",
                )}
              >
                {t("homeWelcome.languageEnglish")}
              </button>
              <button
                type="button"
                onClick={() => setUiLocale("pt")}
                className={cn(
                  "rounded-full px-3 py-1.5 font-medium transition sm:px-3.5",
                  uiLocale === "pt" ? "bg-white/[0.14] text-white" : "text-white/55 hover:text-white/85",
                )}
              >
                {t("homeWelcome.languagePortuguese")}
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    host,
  );
}
