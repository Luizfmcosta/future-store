"use client";

import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import { getBestMatch } from "@/lib/recommendations";
import { getSearchResults } from "@/lib/search";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDemoStore } from "@/store/demoStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function PresenterPanel() {
  const router = useRouter();
  const open = useDemoStore((s) => s.presenterPanelOpen);
  const setOpen = useDemoStore((s) => s.setPresenterOpen);
  const setProfile = useDemoStore((s) => s.setProfile);
  const setAi = useDemoStore((s) => s.setAiMode);
  const setRay = useDemoStore((s) => s.setRayX);
  const ai = useDemoStore((s) => s.aiMode);
  const ray = useDemoStore((s) => s.rayXMode);
  const presetSearch = useDemoStore((s) => s.presetSearch);
  const reset = useDemoStore((s) => s.reset);
  const addToCart = useDemoStore((s) => s.addToCart);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "." && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        useDemoStore.getState().togglePresenter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const jumpPdp = () => {
    presetSearch();
    const state = useDemoStore.getState();
    const pi = state.parsedIntent;
    const prof = state.activeProfile;
    if (!pi) return;
    const results = getSearchResults(prof, pi);
    const best = getBestMatch(prof, results, pi);
    if (best) {
      state.setSelectedProduct(best.id);
      router.push(`/product/${best.id}`);
    }
  };

  const btn =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-left text-[13px] font-medium text-[#e8ecf6] transition hover:bg-white/[0.07]";

  return (
    <StorefrontOverlayPortal>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="pointer-events-auto absolute inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
          <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close" />
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[81] w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0e1016]/95 p-5 shadow-2xl backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Presenter</p>
                <p className="text-sm font-semibold text-white">Demo controls</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-[#9aa3b8] hover:bg-white/[0.06]"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button type="button" className={btn} onClick={() => setProfile("marina")}>
                Switch to Marina
              </button>
              <button type="button" className={btn} onClick={() => setProfile("ricardo")}>
                Switch to Ricardo
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => {
                  presetSearch();
                  router.push("/search");
                }}
              >
                Run default query preset
              </button>
              <button type="button" className={btn} onClick={() => setAi(!ai)}>
                Toggle AI mode ({ai ? "on" : "off"})
              </button>
              <button type="button" className={btn} onClick={() => setRay(!ray)}>
                Toggle X-Ray ({ray ? "on" : "off"})
              </button>
              <button type="button" className={btn} onClick={jumpPdp}>
                Jump to best match PDP
              </button>
              <button
                type="button"
                className={btn}
                onClick={() => {
                  addToCart("sp-roam-2");
                  router.push("/product/sp-roam-2");
                }}
              >
                Open cart drawer (add sample TV)
              </button>
              <button type="button" className={btn} onClick={() => reset()}>
                Reset app state
              </button>
            </div>
            <p className="mt-3 text-[11px] text-[#6f778a]">Shortcut: Ctrl+Shift+. · ⌘+Shift+.</p>
          </motion.div>
        </motion.div>
        ) : null}
      </AnimatePresence>
    </StorefrontOverlayPortal>
  );
}
