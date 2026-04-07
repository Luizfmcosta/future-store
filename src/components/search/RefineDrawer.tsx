"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function RefineDrawer() {
  const open = useDemoStore((s) => s.refineOpen);
  const setOpen = useDemoStore((s) => s.setRefineOpen);
  const t = useT();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label={t("searchSerp.refineCloseAria")}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-stone-200/90 bg-white/98 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(ui.home.eyebrow)}>{t("searchSerp.refineEyebrow")}</p>
                <h2 className="text-lg font-semibold text-stone-900">{t("searchSerp.refineTitle")}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
                aria-label={t("searchSerp.refineCloseAria")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-stone-600">{t("searchSerp.refineBody")}</p>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
