"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { ProductBuyNowButton, ProductExploreLink } from "@/components/shared/ProductCtas";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { products } from "@/data/products";
import { sortProducts } from "@/lib/catalogSort";
import { localizeProducts } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

/** Ricardo merch cards — rotate 10% / 15% / 20% for visual variety */
const RICARDO_DISCOUNT_PCT = [10, 15, 20, 15, 10, 20, 10, 15, 20, 15] as const;

/** Promo list price → sale price (whole BRL, matches badge %). */
function priceAfterRicardoDiscount(listPrice: number, pct: number): number {
  return Math.round((listPrice * (100 - pct)) / 100);
}

/** One card per hero asset — catalog sometimes reuses the same image on different SKUs. */
function takeUniqueHeroProducts(sorted: Product[], limit: number): Product[] {
  const out: Product[] = [];
  const seenId = new Set<string>();
  const seenHero = new Set<string>();
  for (const p of sorted) {
    if (seenId.has(p.id)) continue;
    seenId.add(p.id);
    if (hasMediaUrl(p.heroImage)) {
      if (seenHero.has(p.heroImage)) continue;
      seenHero.add(p.heroImage);
    }
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

/** Same horizontal inset as headline column `px-5` / `sm:px-6` so the first card lines up with the title. */
const merchScrollerStartSpacer = "w-5 shrink-0 snap-none sm:w-6";

export function MerchStrip() {
  const t = useT();
  const profile = useDemoStore((s) => s.activeProfile);
  const uiLocale = useDemoStore((s) => s.uiLocale);
  const experienceCtx = useShopperExperienceOptional();
  const isRicardoPromoFirstVisit =
    profile === "ricardo" &&
    experienceCtx?.experience.segment === "ricardo_speed" &&
    !experienceCtx.signals.isReturning;

  const items = useMemo(() => {
    let base = products.filter((p) => p.category !== "accessory");
    if (isRicardoPromoFirstVisit) {
      base = base.filter((p) => p.category === "tv" && p.price <= 5000);
    }
    const sorted = experienceCtx
      ? sortProducts(base, experienceCtx.experience.merchSort)
      : base;
    return localizeProducts(takeUniqueHeroProducts(sorted, 10));
  }, [experienceCtx?.experience.merchSort, isRicardoPromoFirstVisit, experienceCtx, uiLocale]);

  const merchHeadline1 = experienceCtx ? t(experienceCtx.experience.copy.merchLine1) : t("merch.headlineLine1");
  const merchHeadline2 = experienceCtx ? t(experienceCtx.experience.copy.merchLine2) : t("merch.headlineLine2");
  const showMerchHeadlineSecondLine = !experienceCtx || merchHeadline2.trim().length > 0;

  return (
    <section
      className={cn(
        "@container/merch flex w-full min-w-0 flex-col bg-white pb-44 sm:pb-48",
        ui.home.whiteSectionOnDarkCanvas,
      )}
    >
      <div className="mx-auto w-full min-w-0 max-w-[1200px] px-5 sm:px-6">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center pt-10 text-center"
        >
          <EyebrowPill variant="section">
            {experienceCtx ? t(experienceCtx.experience.copy.merchEyebrow) : t("common.ourProducts")}
          </EyebrowPill>
          <h2 className="mt-2 max-w-[min(100%,38rem)] text-balance text-pretty text-[clamp(1.72rem,5.35vw,2.52rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#1a1a1a]">
            {merchHeadline1}
            {showMerchHeadlineSecondLine ? (
              <>
                <br />
                {merchHeadline2}
              </>
            ) : null}
          </h2>
          {isRicardoPromoFirstVisit ? (
            <p className="mt-2 max-w-[40ch] text-balance text-pretty text-[15px] font-medium leading-snug text-stone-500 sm:text-[16px]">
              {t("merch.ricardoVolumeLine")}
            </p>
          ) : null}
        </motion.div>
      </div>

      {/* Full section width (not inside `max-w-[1200px]`) so the scroll track reaches the storefront edge on every breakpoint — no `cqw` breakout math. */}
      <div className="relative mt-8 min-w-0 w-full sm:mt-10">
        <div className="flex w-full min-w-0 max-w-none items-start snap-x snap-mandatory gap-3.5 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth touch-pan-x scrollbar-none scroll-pl-0 scroll-pr-0">
          <span aria-hidden className={merchScrollerStartSpacer} />
          {items.map((p, i) => {
            const heroSrc = hasMediaUrl(p.heroImage) ? p.heroImage : null;
            const ricardoDiscountPct =
              profile === "ricardo" ? RICARDO_DISCOUNT_PCT[i % RICARDO_DISCOUNT_PCT.length] : null;
            const ricardoSalePrice =
              ricardoDiscountPct != null
                ? priceAfterRicardoDiscount(p.price, ricardoDiscountPct)
                : p.price;
            return (
              <motion.div
                key={p.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 + i * 0.06, ease }}
                className="relative flex w-[72%] max-w-[260px] min-h-0 shrink-0 snap-start flex-col sm:w-[54%] sm:max-w-[300px]"
              >
                <span className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[13px] font-medium tabular-nums text-stone-600">
                  {i + 1}
                </span>
                {ricardoDiscountPct != null ? (
                  <span
                    className="absolute right-2 top-2 z-10 rounded-md border border-stone-200/90 bg-white/95 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums tracking-tight text-stone-800 shadow-sm"
                    aria-hidden
                  >
                    {t("merch.discountOff", { pct: ricardoDiscountPct })}
                  </span>
                ) : null}

                {/* Fixed frame: Ricardo uses a square tile + title under image; Marina keeps 3:4 + gradient title. */}
                <div
                  className={cn(
                    "relative w-full shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5]",
                    profile === "ricardo" ? "aspect-square" : "aspect-[3/4]",
                  )}
                >
                  <AskImageButton
                    productLabel={p.title}
                    productId={p.id}
                    className="absolute inset-0 min-h-0 w-full overflow-hidden rounded-xl bg-[#f5f5f5]"
                  >
                    {heroSrc ? (
                      <div className="absolute inset-0 z-0 min-h-0 overflow-hidden">
                        <Image
                          src={heroSrc}
                          alt=""
                          fill
                          className="object-contain p-4 transition-transform duration-700 ease-out hover:scale-105"
                          sizes="(max-width: 640px) 72vw, 300px"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <EmptyMediaSlot className="absolute inset-0 z-0 rounded-xl" variant="light" />
                    )}
                    {profile === "ricardo" ? null : (
                      <h3 className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-[#f5f5f5] from-[35%] to-transparent px-3 pb-2.5 pt-8 pr-[5.5rem] text-left text-[15px] font-medium leading-snug text-[#1a1a1a] sm:pb-3 sm:pr-24 sm:pt-9">
                        {p.title.split("—")[0].trim()}
                      </h3>
                    )}
                  </AskImageButton>
                </div>

                {profile === "ricardo" ? (
                  <>
                    <h3 className="mt-2 line-clamp-2 text-left text-[15px] font-medium leading-snug text-[#1a1a1a] sm:mt-2.5 sm:text-[16px]">
                      {p.title.split("—")[0].trim()}
                    </h3>
                    {ricardoDiscountPct != null ? (
                      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-left">
                        <span className="text-[15px] font-semibold tabular-nums tracking-tight text-stone-900 sm:text-[16px]">
                          {formatBRL(ricardoSalePrice)}
                        </span>
                        <span className="text-[14px] tabular-nums text-stone-400 line-through sm:text-[15px]">
                          {formatBRL(p.price)}
                        </span>
                        <span className="sr-only">
                          {t("merch.ricardoPromoPriceAria", {
                            sale: formatBRL(ricardoSalePrice),
                            list: formatBRL(p.price),
                            pct: ricardoDiscountPct,
                          })}
                        </span>
                      </p>
                    ) : (
                      <p className="mt-1 text-[15px] font-semibold tabular-nums tracking-tight text-stone-900 sm:text-[16px]">
                        {formatBRL(p.price)}
                      </p>
                    )}
                  </>
                ) : null}

                <div
                  className={cn(
                    "flex items-center gap-1.5",
                    profile === "ricardo" ? "mt-2 sm:mt-2.5" : "mt-2.5 sm:mt-3",
                  )}
                >
                  <ProductBuyNowButton
                    productId={p.id}
                    className={cn(
                      ui.home.focusRing,
                      ui.home.ctaPrimaryFill,
                      "flex h-11 min-h-11 shrink-0 items-center justify-center px-6 text-[15px] sm:text-[16px]",
                    )}
                  >
                    {t("common.buyNow")}
                  </ProductBuyNowButton>
                  <ProductExploreLink
                    productId={p.id}
                    className={cn(
                      ui.home.focusRing,
                      ui.home.ctaSecondaryOutline,
                      "flex h-11 min-h-11 shrink-0 items-center justify-center px-6 text-[15px] sm:text-[16px]",
                    )}
                  >
                    {t("common.explore")}
                  </ProductExploreLink>
                </div>
              </motion.div>
            );
          })}
          <span aria-hidden className="w-3 shrink-0 snap-none sm:w-4" />
        </div>
      </div>
    </section>
  );
}
