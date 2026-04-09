"use client";

import { BundleCard } from "@/components/cart/BundleCard";
import { CheaperOptionCard } from "@/components/cart/CheaperOptionCard";
import { LoyaltyCard } from "@/components/cart/LoyaltyCard";
import { PremiumOptionCard } from "@/components/cart/PremiumOptionCard";
import { StorefrontCartOverlay } from "@/components/cart/StorefrontCartOverlay";
import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import { getProductById } from "@/data/products";
import { getBundleOptions } from "@/lib/bundles";
import { localizeProduct } from "@/lib/product-i18n";
import { useT, type TranslateFn } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

/**
 * Shell subscribes only to open/close so `StorefrontCartOverlay` does not re-render when cart
 * line updates (that was fighting the open animation).
 */
export function CartDrawer() {
  const open = useDemoStore((s) => s.cartDrawerOpen);
  const close = useDemoStore((s) => s.closeCart);
  const t = useT();
  const titleId = useId();

  return (
    <StorefrontOverlayPortal>
      <StorefrontCartOverlay
        open={open}
        modalKey="cart"
        onDismiss={close}
        backdropLabel={t("cart.close")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <CartDrawerBody titleId={titleId} onClose={close} />
      </StorefrontCartOverlay>
    </StorefrontOverlayPortal>
  );
}

function CartDrawerBody({ titleId, onClose }: { titleId: string; onClose: () => void }) {
  const open = useDemoStore((s) => s.cartDrawerOpen);
  const cartLineId = useDemoStore((s) => s.cartLineId);
  const cartQuantity = useDemoStore((s) => s.cartQuantity);
  const incrementCartQuantity = useDemoStore((s) => s.incrementCartQuantity);
  const decrementCartQuantity = useDemoStore((s) => s.decrementCartQuantity);
  const removeFromCart = useDemoStore((s) => s.removeFromCart);
  const profile = useDemoStore((s) => s.activeProfile);
  const t = useT();

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const continueShoppingRef = useRef<HTMLButtonElement>(null);

  const productRaw = cartLineId ? getProductById(cartLineId) : undefined;
  const product = productRaw ? localizeProduct(productRaw) : undefined;
  const bundles =
    product && (product.category === "tv" || product.category === "speaker")
      ? getBundleOptions(profile, product)
      : null;

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      if (product) closeBtnRef.current?.focus();
      else continueShoppingRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, product]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between p-5">
          <div>
            {product ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">{t("cart.label")}</p>
                <h2 id={titleId} className="mt-1 text-xl font-semibold text-stone-900">
                  {t("cart.title")}
                </h2>
              </>
            ) : (
              <h2 id={titleId} className="text-xl font-semibold text-stone-900">
                {t("cart.label")}
              </h2>
            )}
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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-none p-5">
          {product ? (
            <div className="space-y-6">
              <CartLineCard
                product={product}
                quantity={cartQuantity}
                t={t}
                onIncrement={incrementCartQuantity}
                onDecrement={decrementCartQuantity}
                onRemove={removeFromCart}
              />

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
            <div className="flex min-h-[min(60vh,28rem)] flex-1 flex-col items-center justify-center py-6 text-center">
              <div
                className="mb-2 flex size-16 items-center justify-center rounded-full bg-stone-100 text-stone-400"
                aria-hidden
              >
                <ShoppingBag className="size-8 stroke-[1.25]" />
              </div>
              <p className="max-w-[18rem] text-[14px] leading-relaxed text-stone-600">
                {t("cart.emptyDescription")}
              </p>
              <button
                ref={continueShoppingRef}
                type="button"
                onClick={onClose}
                className={cn(
                  "mt-8 inline-flex min-h-11 w-full max-w-[16rem] items-center justify-center rounded-full bg-stone-900 px-6 text-[13px] font-semibold text-white transition-colors hover:bg-stone-800",
                  ui.home.focusRing,
                )}
              >
                {t("cart.continueShopping")}
              </button>
            </div>
          )}
        </div>
        {product ? (
          <div className="border-t border-stone-200/90 p-5">
            <p className="mb-3 flex items-baseline justify-between gap-2 text-[13px] text-stone-600">
              <span>{t("cart.subtotal")}</span>
              <span className="tabular-nums text-[15px] font-semibold text-stone-900">
                {formatBRL(product.price * cartQuantity)}
              </span>
            </p>
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
        ) : null}
      </div>
  );
}

function CartLineCard({
  product,
  quantity,
  t,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  product: Product;
  quantity: number;
  t: TranslateFn;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  const atMax = quantity >= 99;

  return (
    <div className="rounded-2xl border border-stone-200/90 bg-stone-50/90 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="relative h-28 w-[7.25rem] shrink-0 overflow-hidden rounded-xl bg-white/80">
            {hasMediaUrl(product.heroImage) ? (
              <Image
                src={product.heroImage}
                alt={product.title}
                fill
                className="object-contain p-1"
                sizes="116px"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-stone-100 text-[11px] text-stone-400">
                —
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div>
              <p className="text-[12px] font-medium text-stone-500">{t("cart.inBag")}</p>
              <p className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug text-stone-900">{product.title}</p>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-lg font-semibold tabular-nums text-stone-900">{formatBRL(product.price)}</p>
              {product.oldPrice ? (
                <p className={cn(ui.home.priceMuted, "text-base")}>{formatBRL(product.oldPrice)}</p>
              ) : null}
            </div>
            <p className="text-[13px] text-stone-600">{product.installmentText}</p>
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-between gap-3 border-t border-stone-200/60 pt-3 sm:w-auto sm:flex-col sm:items-end sm:justify-between sm:self-stretch sm:border-0 sm:pt-0">
          <div className="flex items-center gap-1 rounded-full border border-stone-200/90 bg-white/90 p-0.5 shadow-sm">
            <button
              type="button"
              onClick={onDecrement}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100",
                ui.home.focusRing,
                "focus-visible:rounded-full",
              )}
              aria-label={t("cart.decreaseQuantity")}
            >
              <Minus className="size-4" strokeWidth={2} aria-hidden />
            </button>
            <span className="min-w-[2ch] text-center text-[15px] font-semibold tabular-nums text-stone-900">{quantity}</span>
            <button
              type="button"
              onClick={onIncrement}
              disabled={atMax}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-35",
                ui.home.focusRing,
                "focus-visible:rounded-full",
              )}
              aria-label={t("cart.increaseQuantity")}
            >
              <Plus className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[12px] font-semibold text-stone-600 transition hover:bg-stone-200/60 hover:text-stone-900",
              ui.home.focusRing,
              "focus-visible:rounded-full",
            )}
          >
            <Trash2 className="size-3.5 shrink-0" aria-hidden />
            {t("cart.removeLine")}
          </button>
        </div>
      </div>
    </div>
  );
}
