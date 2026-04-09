"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDemoStore } from "@/store/demoStore";

const ease = [0.76, 0, 0.24, 1] as const;

const SPLASH_MS = 1600;

/** Set after the first-visit splash has finished (persists across sessions). */
const FIRST_HOME_VISIT_KEY = "fs-storefront-home-first-visit";

/**
 * Home splash when:
 * - First time this browser has completed the home welcome (localStorage), or
 * - Marina ↔ Ricardo profile change while home is mounted.
 * Does not run when returning to `/` from other routes if first visit already completed.
 */
export function HomeLoadingReveal() {
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const [show, setShow] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const prevProfileRef = useRef<typeof activeProfile | undefined>(undefined);
  const splashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSplash = (onComplete?: () => void) => {
    setShow(true);
    if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    splashTimerRef.current = setTimeout(() => {
      setShow(false);
      onComplete?.();
      splashTimerRef.current = null;
    }, SPLASH_MS);
  };

  /* Resolve portal host before paint — avoids rendering the overlay inline in HomeView (white flash). */
  useLayoutEffect(() => {
    setHost(document.querySelector<HTMLElement>("[data-storefront-window]"));
  }, []);

  /* First load of home in this browser — once per lifetime (until localStorage cleared). */
  useEffect(() => {
    try {
      if (localStorage.getItem(FIRST_HOME_VISIT_KEY) === "1") return;
      runSplash(() => {
        try {
          localStorage.setItem(FIRST_HOME_VISIT_KEY, "1");
        } catch {
          /* private mode */
        }
      });
    } catch {
      /* private mode */
    }
    return () => {
      if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    };
  }, []);

  /* Marina ↔ Ricardo while home is already mounted */
  useEffect(() => {
    const prev = prevProfileRef.current;
    prevProfileRef.current = activeProfile;

    if (prev === undefined) return;
    if (prev === activeProfile) return;

    const pair = new Set(["marina", "ricardo"] as const);
    if (!pair.has(prev) || !pair.has(activeProfile)) return;

    runSplash();
    return () => {
      if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    };
  }, [activeProfile]);

  const content = (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease }}
          className="pointer-events-none absolute inset-0 z-[200] flex items-center justify-center rounded-[inherit] bg-[#0c0c0c]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.8, ease }}
            className="flex flex-col items-center gap-5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/fs-reduced.svg"
              alt=""
              className="h-10 w-auto opacity-90"
            />
            <motion.div
              className="h-[2px] rounded-full bg-white/30"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  if (!host) return null;
  return createPortal(content, host);
}
