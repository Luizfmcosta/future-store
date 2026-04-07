"use client";

import { useLocale } from "@/context/LocaleContext";
import { heroCopy } from "@/lib/copy";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/** Distinct filename avoids stale `/media/home-hero.mp4` cache when the asset is replaced. */
const HERO_VIDEO_SRC = "/media/hero-bc3d.mp4";

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
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      /* muted + playsInline usually allows autoplay; ignore if blocked */
    });
  }, []);

  return (
    <section id="home-hero" className="relative flex flex-col">
      <div className="relative flex h-[95svh] min-h-[500px] items-end justify-center overflow-hidden bg-[#0c0c0c]">
        <video
          ref={videoRef}
          key={HERO_VIDEO_SRC}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-black/[0.06] to-black/10" aria-hidden />

        <motion.div
          variants={{ hidden: {}, show: stagger }}
          initial="hidden"
          animate="show"
          className="relative z-10 flex w-full flex-col items-center px-8 pb-36 text-center"
        >
          <motion.p
            variants={child}
            className="text-[13px] font-normal tracking-normal text-white/70 sm:text-[16px]"
          >
            {copy.kicker}
          </motion.p>

          <motion.h1
            variants={child}
            className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.4rem,8.5vw,3.6rem)] font-medium leading-[0.94] tracking-[-0.02em] text-white"
          >
            <span className="block">{copy.titleLine1}</span>
            {copy.titleLine2 ? (
              <span className="block py-[6px] text-white/70">{copy.titleLine2}</span>
            ) : null}
          </motion.h1>
        </motion.div>
      </div>
    </section>
  );
}
