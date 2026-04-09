"use client";

import { BundleCard } from "@/components/cart/BundleCard";
import { CheaperOptionCard } from "@/components/cart/CheaperOptionCard";
import { LoyaltyCard } from "@/components/cart/LoyaltyCard";
import { PremiumOptionCard } from "@/components/cart/PremiumOptionCard";
import { StorefrontRightSheet } from "@/components/shared/StorefrontRightSheet";
import { getProductById } from "@/data/products";
import { getBundleOptions } from "@/lib/bundles";
import { localizeProduct } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

/**
 * Shell subscribes only to open/close so `StorefrontRightSheet` does not re-render when cart
 * line updates (that was fighting the slide animation).
 */
export function CartDrawer() {
  const open = useDemoStore((s) => s.cartDrawerOpen);
  const close = useDemoStore((s) => s.closeCart);
  const t = useT();
  const titleId = useId();

  return (
    <StorefrontRightSheet
      open={open}
      sheetKey="cart"
      onDismiss={close}
      backdropLabel={t("cart.close")}
      zClass="z-[70]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <CartDrawerBody titleId={titleId} onClose={close} />
    </StorefrontRightSheet>
  );
}

function CartDrawerBody({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const open = useDemoStore((s) => s.cartDrawerOpen);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const cartQuantity = useDemoStore((s) => s.cartQuantity);
  const profile = useDemoStore((s) => s.activeProfile);
  const t = useT();

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const productRaw = cartLineId ? getProductById(cartLineId) : undefined;
  const product = productRaw ? localizeProduct(productRaw) : undefined;
  const bundles =
    product && (product.category === "tv" || product.category === "speaker")
      ? getBundleOptions(profile, product)
      : null;

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between border-b border-stone-200/90 p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">{t("cart.label")}</p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold text-stone-900">
              {t("cart.title")}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900",
              ui.home.focusRing,
              "focus-visible:rounded-full",
            )}
            aria-label={t("cart.close")}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-none p-5">
          {product ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-stone-200/90 bg-stone-50/90 p-4">
                <p className="text-[12px] font-medium text-stone-500">{t("cart.inBag")}</p>
                <p className="mt-1 text-[15px] font-semibold text-stone-900">{product.title}</p>
                <p className="mt-1 text-[15px] font-semibold text-stone-900">{t("cart.quantityLine", { qty: cartQuantity })}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <p className="text-lg font-semibold tabular-nums text-stone-900">{formatBRL(product.price)}</p>
                  {product.oldPrice ? (
                    <p className={cn(ui.home.priceMuted, "text-base")}>{formatBRL(product.oldPrice)}</p>
                  ) : null}
                </div>
                <p className="mt-1 text-[13px] text-stone-600">{product.installmentText}</p>
              </div>

              {bundles?.primary ? (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{t("cart.recommendedBundle")}</p>
                  <BundleCard option={bundles.primary} highlight />
                </div>
              ) : null}

              {bundles?.premium ? (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{t("cart.premiumAlternative")}</p>
                  <PremiumOptionCard option={bundles.premium} />
                </div>
              ) : null}

              {bundles?.cheaper ? (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{t("cart.cheaperAlternative")}</p>
                  <CheaperOptionCard option={bundles.cheaper} />
                </div>
              ) : null}

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{t("cart.extendedPeace")}</p>
                <LoyaltyCard />
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-stone-600">{t("cart.emptyHint")}</p>
          )}
        </div>
        <div className="border-t border-stone-200/90 p-5">
          {product ? (
            <p className="mb-3 flex items-baseline justify-between gap-2 text-[13px] text-stone-600">
              <span>{t("cart.subtotal")}</span>
              <span className="tabular-nums text-[15px] font-semibold text-stone-900">
                {formatBRL(product.price * cartQuantity)}
              </span>
            </p>
          ) : null}
          <button
            type="button"
            className={cn(
              "w-full rounded-full bg-stone-200 py-3 text-sm font-semibold text-stone-700 opacity-60",
              ui.home.focusRing,
              "focus-visible:opacity-100",
            )}
            disabled
          >
            {t("cart.checkoutDemo")}
          </button>
        </div>
      </div>
  );
}
