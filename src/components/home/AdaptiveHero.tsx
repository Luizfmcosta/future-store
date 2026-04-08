"use client";

import { RicardoPromoHero } from "@/components/home/RicardoPromoHero";
import { useLocale } from "@/context/LocaleContext";
import { heroCopy } from "@/lib/copy";
import { STOREFRONT_HERO_VIDEO_SRC } from "@/lib/storefrontHeroVideo";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.14, delayChildren: 1.5 };
const child = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export function AdaptiveHero() {
  const profile = useDemoStore((s) => s.activeProfile);
  const { locale } = useLocale();
  const copy = heroCopy(profile, locale);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      <div className="relative flex h-[95svh] min-h-[500px] items-end justify-center overflow-hidden bg-[#0c0c0c]">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/[0.06] to-black/10" aria-hidden />

        <motion.div
          variants={{ hidden: {}, show: stagger }}
          initial="hidden"
          animate="show"
          className="relative z-10 flex w-full -translate-y-8 flex-col items-center px-4 pb-36 text-center @min-[480px]:px-8"
        >
          <motion.p
            variants={child}
            className="text-[14px] font-normal tracking-normal text-white/70 @min-[480px]:text-[16px]"
          >
            {copy.kicker}
          </motion.p>

          {/* Smaller type + wrap on narrow viewports so long headlines don’t overflow the storefront frame */}
          <motion.h1
            variants={child}
            className="mt-2 min-w-0 max-w-[min(100%,22rem)] font-[family-name:var(--font-display)] font-medium tracking-[-0.02em] text-white @min-[480px]:max-w-full @min-[480px]:leading-[0.94]"
          >
            <span className="block text-balance text-[clamp(1.65rem,7.8cqi,2.55rem)] leading-[1.12] @min-[480px]:text-[clamp(1.9rem,7cqi,3.15rem)] @min-[480px]:leading-[0.94]">
              {copy.titleLine1}
            </span>
            {copy.titleLine2 ? (
              <span className="block text-balance py-1 text-[clamp(1.5rem,7.2cqi,2.35rem)] leading-[1.12] text-white/70 @min-[480px]:py-[6px] @min-[480px]:text-[clamp(1.75rem,6.5cqi,2.85rem)] @min-[480px]:leading-[0.94]">
                {copy.titleLine2}
              </span>
            ) : null}
          </motion.h1>
        </motion.div>
      </div>
    </section>
  );
}
