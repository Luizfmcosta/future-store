"use client";

import { AgentLayerPanel } from "@/components/rayx/AgentLayerPanel";
import { HumanLayerPanel } from "@/components/rayx/HumanLayerPanel";
import { MerchantLayerPanel } from "@/components/rayx/MerchantLayerPanel";
import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import {
  STOREFRONT_RAYX_PANEL_MAX_SLIDE_PX,
  storefrontSheetBackdropExitTransition,
  storefrontSheetBackdropTransition,
  storefrontSheetPanelExitTransition,
  storefrontSheetPanelTransition,
} from "@/lib/storefrontSheetMotion";
import { useDemoStore } from "@/store/demoStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const rayxPanelSlidePx = STOREFRONT_RAYX_PANEL_MAX_SLIDE_PX;

export function RayXOverlay() {
  const open = useDemoStore((s) => s.rayXMode);
  const setOpen = useDemoStore((s) => s.setRayX);
  const selected = useDemoStore((s) => s.selectedProductId);
  const profile = useDemoStore((s) => s.activeProfile);

  return (
    <StorefrontOverlayPortal>
      <div className="pointer-events-none absolute inset-0 z-[50] overflow-hidden">
        <AnimatePresence>
          {open
            ? [
                <motion.button
                  key="rayx-backdrop"
                  type="button"
                  aria-label="Close X-Ray"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: storefrontSheetBackdropExitTransition }}
                  transition={storefrontSheetBackdropTransition}
                  className="pointer-events-auto absolute inset-0 z-0 bg-[#030406]/55 backdrop-blur-[2px]"
                  onClick={() => setOpen(false)}
                />,
                <motion.aside
                  key="rayx-panel"
                  layout={false}
                  initial={{ x: rayxPanelSlidePx }}
                  animate={{ x: 0 }}
                  exit={{
                    x: rayxPanelSlidePx,
                    transition: storefrontSheetPanelExitTransition,
                  }}
                  transition={storefrontSheetPanelTransition}
                  className="pointer-events-auto absolute inset-y-3 right-3 z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[#0a0c11]/90 shadow-[0_20px_56px_-28px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:inset-y-6 sm:right-6"
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
                  <div className="flex-1 space-y-8 overflow-y-auto scrollbar-none px-5 py-5">
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
                </motion.aside>,
              ]
            : null}
        </AnimatePresence>
      </div>
    </StorefrontOverlayPortal>
  );
}
