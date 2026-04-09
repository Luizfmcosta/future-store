"use client";

import { RicardoPromoHero } from "@/components/home/RicardoPromoHero";
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
  const copy = heroCopy(profile);
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
      <div className="relative flex h-[95svh] min-h-[500px] w-full shrink-0 flex-col overflow-hidden bg-[#0c0c0c]">
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
        <div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-end px-4 pb-28 pt-24 sm:justify-center sm:px-6 sm:pb-16 sm:pt-20">
          <motion.div
            variants={{ hidden: {}, show: stagger }}
            initial="hidden"
            animate="show"
            className="@container flex w-full max-w-[min(28rem,calc(100cqw-2rem))] translate-y-6 flex-col items-center text-center"
          >
            <motion.p
              variants={child}
              className="max-w-full text-[15px] font-normal tracking-normal text-white/70 @min-[480px]:text-[17px]"
            >
              {copy.kicker}
            </motion.p>

            {/* Smaller type + wrap on narrow viewports so long headlines don’t overflow the storefront frame */}
            <motion.h1
              variants={child}
              className="mt-2 w-full min-w-0 text-center font-medium tracking-[-0.02em] text-white @min-[480px]:leading-[0.94]"
            >
              <span className="block text-balance text-center text-[clamp(1.78rem,8cqi,2.72rem)] leading-[1.12] @min-[480px]:text-[clamp(2.02rem,7.2cqi,3.35rem)] @min-[480px]:leading-[0.94]">
                {copy.titleLine1}
              </span>
              {copy.titleLine2 ? (
                <span className="block text-balance py-1 text-center text-[clamp(1.62rem,7.4cqi,2.5rem)] leading-[1.12] text-white/70 @min-[480px]:py-[6px] @min-[480px]:text-[clamp(1.88rem,6.7cqi,3rem)] @min-[480px]:leading-[0.94]">
                  {copy.titleLine2}
                </span>
              ) : null}
            </motion.h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
