"use client";

import { BundleCard } from "@/components/cart/BundleCard";
import { CheaperOptionCard } from "@/components/cart/CheaperOptionCard";
import { LoyaltyCard } from "@/components/cart/LoyaltyCard";
import { PremiumOptionCard } from "@/components/cart/PremiumOptionCard";
import { getProductById } from "@/data/products";
import { getBundleOptions } from "@/lib/bundles";
import { formatBRL } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function CartDrawer() {
  const open = useDemoStore((s) => s.cartDrawerOpen);
  const close = useDemoStore((s) => s.closeCart);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const profile = useDemoStore((s) => s.activeProfile);

  const product = cartLineId ? getProductById(cartLineId) : undefined;
  const bundles = product && product.category === "tv" ? getBundleOptions(profile, product) : null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="absolute inset-0 bg-black/55 backdrop-blur-md" onClick={close} aria-label="Close cart" />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/[0.08] bg-[#090a0f]/92 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between border-b border-white/[0.06] p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7d869c]">Cart</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Complete your viewing experience</h2>
                </div>
                <button type="button" onClick={close} className="rounded-full p-2 text-[#9aa3b8] hover:bg-white/[0.06]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {product ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                      <p className="text-[12px] font-medium text-[#8b93a7]">In bag</p>
                      <p className="mt-1 text-[15px] font-semibold text-[#f0f3fa]">{product.title}</p>
                      <p className="mt-2 text-lg font-semibold">{formatBRL(product.price)}</p>
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
                <button
                  type="button"
                  className="w-full rounded-full bg-[#eef1f7] py-3 text-sm font-semibold text-[#0b0c0f] opacity-60"
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
