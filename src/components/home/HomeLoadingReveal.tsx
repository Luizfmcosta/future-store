"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Loading reveal scoped to the storefront window.
 * Renders into the [data-storefront-window] container via a portal
 * so it covers only the site preview, not the whole page.
 */
export function HomeLoadingReveal() {
  const [show, setShow] = useState(true);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-storefront-window]");
    setHost(el);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const content = (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
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

  if (host) return createPortal(content, host);
  return content;
}
