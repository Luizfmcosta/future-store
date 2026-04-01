"use client";

import { AgentLayerPanel } from "@/components/rayx/AgentLayerPanel";
import { HumanLayerPanel } from "@/components/rayx/HumanLayerPanel";
import { MerchantLayerPanel } from "@/components/rayx/MerchantLayerPanel";
import { useDemoStore } from "@/store/demoStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function RayXOverlay() {
  const open = useDemoStore((s) => s.rayXMode);
  const setOpen = useDemoStore((s) => s.setRayX);
  const selected = useDemoStore((s) => s.selectedProductId);
  const profile = useDemoStore((s) => s.activeProfile);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[50] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-[#030406]/55 backdrop-blur-[2px]" onClick={() => setOpen(false)} role="presentation" />
          <motion.aside
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative m-3 flex h-[calc(100%-24px)] w-full max-w-lg flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#0a0c11]/90 shadow-[0_20px_56px_-28px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:m-6"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7d869c]">X-Ray</p>
                <p className="text-lg font-semibold text-white">Two-faced storefront</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-[#9aa3b8] hover:bg-white/[0.06]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-8 overflow-y-auto px-5 py-5">
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b93a7]">What the shopper sees</h3>
                <div className="mt-3">
                  <HumanLayerPanel />
                </div>
              </section>
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b93a7]">What the merchant controls</h3>
                <div className="mt-3">
                  <MerchantLayerPanel />
                </div>
              </section>
              <section>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b93a7]">What the agent consumes</h3>
                <p className="mt-2 text-[12px] text-[#7d869c]">Structured surface derived from the same product record.</p>
                <div className="mt-3">
                  <AgentLayerPanel skuId={selected} profile={profile} />
                </div>
              </section>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
