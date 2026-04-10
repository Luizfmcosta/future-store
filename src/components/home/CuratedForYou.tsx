"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { ProductBuyNowButton, ProductExploreLink } from "@/components/shared/ProductCtas";
import {
  getCuratedMarinaCardHeroOverride,
  getProductById,
  getPromoTvsUnder,
} from "@/data/products";
import { localizeProducts } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.06 };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

/**
 * 16:10 media slot — `max-h` uses `svh` so on short viewports the image yields space
 * before title/blurb/CTAs; avoid `max-h` on the whole card (that clipped the buttons).
 */
const curatedMediaShell =
  "aspect-[16/10] w-full min-h-0 max-h-[min(36svh,220px)] sm:max-h-[min(42svh,280px)] @md:max-h-[min(44svh,320px)]";

function shortTitle(p: Product) {
  return p.title.split("—")[0].trim();
}

function MarinaCompareCard({
  product,
  tierLabel,
  displayTitle,
  displaySubline,
  displayBlurb,
  heroImageOverride,
}: {
  product: Product;
  tierLabel: string;
  displayTitle?: string;
  displaySubline?: string;
  displayBlurb?: string;
  /** When card title describes a bundle but PDP is one SKU (e.g. Stage Compact + SubStage Mini). */
  heroImageOverride?: string;
}) {
  const t = useT();
  const resolvedHero = heroImageOverride ?? product.heroImage;
  const heroSrc = hasMediaUrl(resolvedHero) ? resolvedHero : null;
  const title = displayTitle ?? shortTitle(product);
  const blurb = displayBlurb ?? (product.bestFor[0] ?? product.reviewStrengths[0]);

  return (
    <motion.article
      variants={fadeUp}
      className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white"
    >
      <div className="relative w-full shrink-0">
        <AskImageButton
          productLabel={product.title}
          productId={product.id}
          className={cn(
            curatedMediaShell,
            "w-full overflow-hidden bg-[#f5f5f5]",
          )}
        >
          {heroSrc ? (
            <div className="relative h-full min-h-0 w-full">
              <Image
                src={heroSrc}
                alt=""
                fill
                className="object-contain object-center p-3 sm:p-4"
                sizes="(max-width: 480px) 45vw, 400px"
                unoptimized
              />
            </div>
          ) : (
            <EmptyMediaSlot className="relative min-h-[8rem]" variant="light" />
          )}
        </AskImageButton>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[15px] font-normal leading-relaxed text-stone-600 sm:text-[17px] sm:leading-[1.65]">
            {tierLabel}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 p-5 sm:p-6">
        <div className="min-w-0 space-y-2">
          <h3 className="text-[15px] font-semibold leading-snug text-[#1a1a1a] sm:text-[16px]">
            {title}
          </h3>
          {displaySubline ? (
            <p className="text-[15px] font-medium leading-snug text-stone-500 sm:text-[16px]">{displaySubline}</p>
          ) : null}
          <p className="text-[15px] font-semibold tabular-nums tracking-tight text-stone-900 sm:text-[16px]">
            {formatBRL(product.price)}
          </p>
          <p className="text-pretty text-[15px] font-normal leading-relaxed text-stone-600 line-clamp-3 sm:text-[17px] sm:leading-[1.65]">
            {blurb}
          </p>
        </div>
        <div className="mt-auto flex flex-col gap-2.5 @sm:flex-row">
          <ProductExploreLink
            productId={product.id}
            className={cn(
              ui.home.focusRing,
              ui.home.ctaSecondaryOutline,
              "flex h-11 min-h-0 flex-1 items-center justify-center text-[15px] sm:text-[16px]",
            )}
          >
            {t("common.explore")}
          </ProductExploreLink>
          <ProductBuyNowButton
            productId={product.id}
            className={cn(
              ui.home.focusRing,
              ui.home.ctaPrimaryFill,
              "flex h-11 min-h-0 flex-1 items-center justify-center text-[15px] sm:text-[16px]",
            )}
          >
            {t("common.buyNow")}
          </ProductBuyNowButton>
        </div>
      </div>
    </motion.article>
  );
}

function RicardoPickCard({ product }: { product: Product }) {
  const t = useT();
  const heroSrc = hasMediaUrl(product.heroImage) ? product.heroImage : null;
  const blurb = product.reviewStrengths[0];

  return (
    <motion.article
      variants={fadeUp}
      className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white"
    >
      <AskImageButton
        productLabel={product.title}
        productId={product.id}
        className={cn(curatedMediaShell, "w-full shrink-0 overflow-hidden bg-[#f5f5f5]")}
      >
        {heroSrc ? (
          <div className="relative h-full min-h-0 w-full">
            <Image
              src={heroSrc}
              alt=""
              fill
              className="object-contain object-center p-3 sm:p-4"
              sizes="(max-width: 480px) 100vw, 400px"
              unoptimized
            />
          </div>
        ) : (
          <EmptyMediaSlot className="relative min-h-[8rem]" variant="light" />
        )}
      </AskImageButton>
      <div className="flex shrink-0 flex-col gap-3 overflow-hidden p-5 sm:p-6">
        <div>
          <h3 className="text-[15px] font-medium leading-snug text-[#1a1a1a]">{shortTitle(product)}</h3>
          <p className="mt-1 text-pretty text-[15px] font-normal leading-relaxed text-stone-500 line-clamp-2">{blurb}</p>
          <p className="mt-2 text-[16px] font-semibold tabular-nums text-stone-900">{formatBRL(product.price)}</p>
        </div>
        <div className="flex gap-2">
          <ProductExploreLink
            productId={product.id}
            className={cn(
              ui.home.focusRing,
              ui.home.ctaSecondaryOutline,
              "flex h-11 flex-1 items-center justify-center text-[15px]",
            )}
          >
            {t("common.explore")}
          </ProductExploreLink>
          <ProductBuyNowButton
            productId={product.id}
            className={cn(
              ui.home.focusRing,
              ui.home.ctaPrimaryFill,
              "flex h-11 flex-1 items-center justify-center text-[15px]",
            )}
          >
            {t("common.buyNow")}
          </ProductBuyNowButton>
        </div>
      </div>
    </motion.article>
  );
}

export function CuratedForYou() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const t = useT();

  const isRicardoPromoFirstVisit =
    profile === "ricardo" &&
    experienceCtx?.experience.segment === "ricardo_speed" &&
    !experienceCtx.signals.isReturning;

  const pair = useMemo(() => {
    if (isRicardoPromoFirstVisit) {
      return localizeProducts(getPromoTvsUnder(5000).slice(0, 2));
    }
    /* Marina: fixed pair matches curated card titles (Stage Compact + sub vs Stage Ultra surround). */
    if (profile === "marina") {
      const a = getProductById("sb-beam-g2");
      const b = getProductById("sp-home-theater");
      if (!a || !b) return [];
      return localizeProducts([a, b]);
    }
    /* Ricardo: ~R$ 2k picks — portable + compact soundbar (Era 100 hero repeats in merch below). */
    if (profile === "ricardo") {
      const a = getProductById("sp-roam-2");
      const b = getProductById("sb-ray");
      if (!a || !b) return [];
      return localizeProducts([a, b]);
    }
    return [];
  }, [profile, isRicardoPromoFirstVisit]);

  return (
    <section className={cn("flex flex-col bg-white", ui.home.whiteSectionOnDarkCanvas)}>
      {/* Same max width as CompareModule / ContinueJourney (`max-w-[1200px]`). */}
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease }}
          className="flex flex-col items-center pb-14 pt-16 text-center sm:pb-16 sm:pt-20"
        >
          <h2 className="max-w-[min(100%,34rem)] whitespace-pre-line text-balance text-pretty text-[clamp(1.92rem,5.45vw,2.88rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[#1a1a1a]">
            {isRicardoPromoFirstVisit
              ? t("curated.ricardoPromoHeadline")
              : profile === "marina"
                ? t("curated.marinaHeadline")
                : t("curated.ricardoHeadline")}
          </h2>
          <p className="mt-4 max-w-[min(100%,38rem)] text-balance text-pretty text-[16px] font-normal leading-[1.75] text-[#888] sm:mt-5 sm:text-[18px] sm:leading-[1.75]">
            {isRicardoPromoFirstVisit
              ? t("curated.ricardoPromoBody")
              : profile === "marina"
                ? t("curated.marinaBody")
                : t("curated.ricardoBody")}
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: stagger }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          className={cn(
            "pb-9 sm:pb-10",
            profile === "marina"
              ? "grid min-h-0 grid-cols-1 items-stretch gap-6 @md:grid-cols-2 sm:gap-8"
              : "flex flex-col gap-6 sm:gap-8",
          )}
        >
          {profile === "marina" ? (
            <>
              {pair.map((p, i) => (
                <MarinaCompareCard
                  key={p.id}
                  product={p}
                  tierLabel={i === 0 ? t("curated.marinaTierA") : t("curated.marinaTierB")}
                  heroImageOverride={getCuratedMarinaCardHeroOverride(p.id)}
                  displayTitle={
                    profile === "marina"
                      ? i === 0
                        ? t("curated.marinaCardATitle")
                        : t("curated.marinaCardBTitle")
                      : undefined
                  }
                  displaySubline={
                    profile === "marina"
                      ? i === 0
                        ? t("curated.marinaCardASub")
                        : t("curated.marinaCardBSub")
                      : undefined
                  }
                  displayBlurb={
                    profile === "marina"
                      ? i === 0
                        ? t("curated.marinaCardABlurb")
                        : t("curated.marinaCardBBlurb")
                      : undefined
                  }
                />
              ))}
            </>
          ) : (
            pair.map((p) => <RicardoPickCard key={p.id} product={p} />)
          )}
        </motion.div>
      </div>
    </section>
  );
}
