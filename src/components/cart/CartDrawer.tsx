"use client";

import { BundleCard } from "@/components/cart/BundleCard";
import { CheaperOptionCard } from "@/components/cart/CheaperOptionCard";
import { LoyaltyCard } from "@/components/cart/LoyaltyCard";
import { PremiumOptionCard } from "@/components/cart/PremiumOptionCard";
import { getProductById } from "@/data/products";
import { getBundleOptions } from "@/lib/bundles";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

export function CartDrawer() {
  const open = useDemoStore((s) => s.cartDrawerOpen);
  const close = useDemoStore((s) => s.closeCart);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const profile = useDemoStore((s) => s.activeProfile);

  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const product = cartLineId ? getProductById(cartLineId) : undefined;
  const bundles = product && product.category === "tv" ? getBundleOptions(profile, product) : null;

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <button type="button" className="absolute inset-0 bg-black/55 backdrop-blur-md" onClick={close} aria-label="Close cart" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/[0.08] bg-[#090a0f]/92 text-[#eef1f6] shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between border-b border-white/[0.06] p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7d869c]">Cart</p>
                  <h2 id={titleId} className="mt-1 text-xl font-semibold text-white">
                    Complete your viewing experience
                  </h2>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={close}
                  className={cn(
                    "rounded-full p-2 text-[#9aa3b8] hover:bg-white/[0.06] hover:text-[#eef1f6]",
                    ui.focusRing,
                    "focus-visible:rounded-full",
                  )}
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {product ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="text-[12px] font-medium text-[#8b93a7]">In bag</p>
                      <p className="mt-1 text-[15px] font-semibold text-[#f0f3fa]">{product.title}</p>
                      <div className="mt-2 flex flex-wrap items-baseline gap-2">
                        <p className="text-lg font-semibold tabular-nums text-white">{formatBRL(product.price)}</p>
                        {product.oldPrice ? (
                          <p className={cn(ui.priceMuted, "text-base")}>{formatBRL(product.oldPrice)}</p>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[13px] text-[#b4bcd1]">{product.installmentText}</p>
                    </div>

                    {bundles?.primary ? (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d869c]">Recommended bundle</p>
                        <BundleCard option={bundles.primary} highlight />
                      </div>
                    ) : null}

                    {bundles?.premium ? (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d869c]">Premium alternative</p>
                        <PremiumOptionCard option={bundles.premium} />
                      </div>
                    ) : null}

                    {bundles?.cheaper ? (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d869c]">Cheaper alternative</p>
                        <CheaperOptionCard option={bundles.cheaper} />
                      </div>
                    ) : null}

                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d869c]">Extended peace of mind</p>
                      <LoyaltyCard />
                    </div>
                  </div>
                ) : (
                  <p className="text-[14px] text-[#9aa3b8]">Add a TV from the PDP to see contextual merchandising.</p>
                )}
              </div>
              <div className="border-t border-white/[0.06] p-5">
                {product ? (
                  <p className="mb-3 flex items-baseline justify-between gap-2 text-[13px] text-[#9aa3b8]">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-[15px] font-semibold text-[#eef1f6]">{formatBRL(product.price)}</span>
                  </p>
                ) : null}
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-full bg-[#eef1f7] py-3 text-sm font-semibold text-[#0b0c0f] opacity-60",
                    ui.focusRing,
                    "focus-visible:opacity-100",
                  )}
                  disabled
                >
                  Checkout (demo)
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
