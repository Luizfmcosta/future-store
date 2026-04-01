"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";

export function WhySeeingThis() {
  const [open, setOpen] = useState(false);
  const profile = useDemoStore((s) => s.activeProfile);

  return (
    <div className="mt-6 border-t border-white/[0.06] pt-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-start gap-2.5 rounded-lg text-left transition-colors",
          "-mx-1 px-1 py-1.5",
          "hover:bg-white/[0.04]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0",
          "active:bg-white/[0.03]"
        )}
        aria-expanded={open}
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#8b96a8]" strokeWidth={2} aria-hidden />
        <span className={cn(ui.label, "min-w-0 flex-1 leading-snug")}>Why am I seeing this?</span>
        <ChevronDown
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-[#9ca8b8] transition-transform duration-200 ease-out",
            open && "rotate-180"
          )}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className={cn(ui.body, "mt-3 text-[12px] leading-relaxed")}>
              {profile === "marina"
                ? "Your profile prioritizes premium assortments, technical proof, and compare-first modules — with OLED-forward ranking."
                : "Your profile prioritizes campaign value, popular sizes, and direct proof signals — with price-forward ranking."}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
