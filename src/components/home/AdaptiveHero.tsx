"use client";

import { RicardoPromoHero } from "@/components/home/RicardoPromoHero";
import { heroCopy } from "@/lib/copy";
import { STOREFRONT_HERO_VIDEO_SRC } from "@/lib/storefrontHeroVideo";
import { useStorefrontFrameHeightClass } from "@/lib/hooks/useStorefrontFrameHeightClass";
import { STOREFRONT_HERO_BOTTOM_BLEED, STOREFRONT_HERO_COPY_BOTTOM_PAD } from "@/lib/storefrontViewport";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.14, delayChildren: 1.5 };
const child = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export function AdaptiveHero() {
  const profile = useDemoStore((s) => s.activeProfile);
  /** Subscribe so `heroCopy` → `getMessage` re-runs when the shopper switches UI language. */
  const uiLocale = useDemoStore((s) => s.uiLocale);
  const copy = useMemo(() => heroCopy(profile), [profile, uiLocale]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const storefrontFrameHeightClass = useStorefrontFrameHeightClass();

  useEffect(() => {
    if (profile === "ricardo") return;
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      /* muted + playsInline usually allows autoplay; ignore if blocked */
    });
  }, [profile]);

  if (profile === "ricardo") {
    return <RicardoPromoHero />;
  }

  return (
    <section id="home-hero" className="relative flex flex-col">
      <div
        className={cn(
          "relative flex w-full shrink-0 flex-col overflow-hidden bg-[#0c0c0c]",
          storefrontFrameHeightClass,
        )}
      >
        <video
          ref={videoRef}
          key={STOREFRONT_HERO_VIDEO_SRC}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={STOREFRONT_HERO_VIDEO_SRC} type="video/mp4" />
        </video>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-[#000]"
          aria-hidden
        />

        {/* Same horizontal + vertical framing as `RicardoPromoHero` so copy stays centered in the preview. */}
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
              {copy.kicker}
            </motion.p>

            {/* Smaller type + wrap on narrow viewports so long headlines don’t overflow the storefront frame */}
            <motion.h1
              variants={child}
              className="mt-2 w-full min-w-0 text-center font-medium tracking-[-0.02em] text-white @min-[480px]:leading-[0.94]"
            >
              {/*
                Narrow: lower floor + 10cqi cap (~2.4rem) so phone frames read smaller; @480+ scales toward 52pt.
              */}
              <span className="block text-balance text-center text-[clamp(1.62rem,min(10cqi,2.4rem),2.4rem)] leading-[1.12] @min-[480px]:text-[clamp(2.1rem,min(14cqi,52pt),52pt)] @min-[480px]:leading-[0.94]">
                {copy.titleLine1}
              </span>
              {copy.titleLine2 ? (
                <span className="block text-balance py-1 text-center text-[clamp(1.52rem,6.5cqi,2.28rem)] leading-[1.12] text-white/70 @min-[480px]:py-[6px] @min-[480px]:text-[clamp(2rem,7.2cqi,3.25rem)] @min-[480px]:leading-[0.94]">
                  {copy.titleLine2}
                </span>
              ) : null}
            </motion.h1>
          </motion.div>
        </div>
      </div>
      <div className={cn(STOREFRONT_HERO_BOTTOM_BLEED, "bg-[#0c0c0c]")} aria-hidden />
    </section>
  );
}
