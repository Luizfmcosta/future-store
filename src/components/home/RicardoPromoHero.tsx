"use client";

import { getCheapestPromoSpeaker } from "@/data/products";
import { useStorefrontFrameHeightClass } from "@/lib/hooks/useStorefrontFrameHeightClass";
import { STOREFRONT_HERO_BOTTOM_BLEED, STOREFRONT_HERO_COPY_BOTTOM_PAD } from "@/lib/storefrontViewport";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

/** Lifestyle — portable speakers (copy over full-bleed looped video). */
const HERO_VIDEO = "/media/home/ricardo-promo-hero-portable-speakers.mp4";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.14, delayChildren: 1.5 };
const child = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

function ricardoHeadlineLines(headline: string): string[] {
  return headline
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function RicardoPromoHero() {
  const storefrontFrameHeightClass = useStorefrontFrameHeightClass();
  const t = useT();
  const cheapest = getCheapestPromoSpeaker();
  const fromPrice = cheapest ? formatBRL(cheapest.price) : "—";
  const headlineLines = ricardoHeadlineLines(t("hero.ricardoPromo.headline"));

  return (
    <section id="home-hero" className="relative flex flex-col">
      <div
        className={cn(
          "relative flex w-full shrink-0 flex-col overflow-hidden bg-[#0a0a0a]",
          storefrontFrameHeightClass,
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover object-[center_28%] opacity-90"
            aria-hidden
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000]"
            aria-hidden
          />
        </div>

        <div
          className={cn(
            "relative z-10 flex h-full min-h-0 flex-col items-center justify-end px-4 pt-24 sm:px-6 sm:pt-20",
            STOREFRONT_HERO_COPY_BOTTOM_PAD,
          )}
        >
          <motion.div
            variants={{ hidden: {}, show: stagger }}
            initial="hidden"
            animate="show"
            className="@container flex w-full max-w-[min(64rem,calc(100cqw-2rem))] flex-col items-center text-center"
          >
            <motion.p
              variants={child}
              className="max-w-full text-[20px] font-medium tracking-normal text-white/70 @min-[480px]:text-[23px]"
            >
              {t("hero.ricardoPromo.kicker")}
            </motion.p>
            {/* Same scale as `AdaptiveHero` (Marina) — clamp up to 52pt via container query, not a fixed 42px one-line span. */}
            <motion.h1
              variants={child}
              className="mt-2 w-full min-w-0 text-center font-medium tracking-[-0.02em] text-white @min-[480px]:leading-[0.94]"
            >
              {headlineLines.map((line, i) => (
                <span
                  key={i}
                  className={cn(
                    "block max-w-full hyphens-none text-center whitespace-nowrap text-[clamp(1.62rem,min(10cqi,2.4rem),2.4rem)] leading-[1.12] @min-[480px]:text-[clamp(2.1rem,min(14cqi,52pt),52pt)] @min-[480px]:leading-[0.94]",
                    headlineLines.length > 1 && i > 0 && "mt-[0.28em]",
                    headlineLines.length > 1 && "whitespace-normal text-balance",
                  )}
                >
                  {line}
                </span>
              ))}
            </motion.h1>
            <motion.p
              variants={child}
              className="mt-2 text-[22px] font-semibold tabular-nums text-white @min-[480px]:text-[24px]"
            >
              <span className="font-normal text-white/75">{t("hero.ricardoPromo.fromLabel")} </span>
              {fromPrice}
            </motion.p>

            <motion.div variants={child} className="mt-5 flex w-full justify-center">
              <Link
                href="/search"
                className={cn(
                  ui.home.focusRing,
                  ui.home.ctaOnDarkHero,
                  "inline-flex h-12 min-h-12 w-full shrink-0 items-center justify-center px-6 text-[15px] @min-[480px]:text-[16px] sm:w-auto sm:min-w-[9.5rem]",
                )}
              >
                {t("hero.ricardoPromo.cta")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className={cn(STOREFRONT_HERO_BOTTOM_BLEED, "bg-[#0a0a0a]")} aria-hidden />
    </section>
  );
}
