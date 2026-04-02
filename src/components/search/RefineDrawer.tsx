"use client";

import { useDemoStore } from "@/store/demoStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function RefineDrawer() {
  const open = useDemoStore((s) => s.refineOpen);
  const setOpen = useDemoStore((s) => s.setRefineOpen);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close" />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/[0.08] bg-[#0b0d12]/95 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Refine</p>
                <h2 className="text-lg font-semibold text-white">Intent adjustments</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-[#9aa3b8] hover:bg-white/[0.06]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-[#aeb6ca]">
              In production, refinements would re-rank deterministically. Here, use profile + chips to steer the narrative.
            </p>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
