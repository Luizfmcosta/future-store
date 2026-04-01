"use client";

import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { heroCopy } from "@/lib/copy";
import { getProductById } from "@/data/products";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Link from "next/link";

const heroEase = [0.22, 1, 0.36, 1] as const;

const heroCardGradient =
  "bg-[linear-gradient(165deg,#1e2838_0%,#181f2c_38%,#121820_72%,#0e141c_100%)]";

const heroCardShell = cn(
  heroCardGradient,
  "shadow-[0_16px_48px_-24px_rgba(0,0,0,0.55)]"
);

/** Bottom-only scrim for headline — not full-bleed so it never sits under the media area */
const heroBottomScrim =
  "bg-[linear-gradient(to_top,rgba(14,18,26,0.97)_0%,rgba(17,22,32,0.82)_18%,rgba(18,24,34,0.38)_40%,transparent_100%)]";

export function AdaptiveHero() {
  const profile = useDemoStore((s) => s.activeProfile);
  const copy = heroCopy(profile);
  const featuredId = profile === "marina" ? "tv-aurora-oled-65" : "tv-pulse-led-55";
  const product = getProductById(featuredId);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: heroEase }}
      className={cn(
        "relative flex min-h-[min(460px,80dvh)] flex-col overflow-hidden rounded-2xl",
        "sm:min-h-[min(520px,76dvh)] md:min-h-[min(560px,72dvh)] lg:min-h-[min(600px,70dvh)]",
        ui.hairline,
        heroCardShell
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 top-[45%] z-0 sm:top-[48%]",
          heroBottomScrim
        )}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] flex items-start justify-center px-3 pb-32 pt-4 sm:px-6 sm:pb-36 sm:pt-5 md:pb-40 md:pt-6 lg:pb-44"
        aria-hidden
      >
        <div className="relative w-full max-w-[min(32rem,calc(100%-0.5rem))] sm:max-w-2xl md:max-w-3xl lg:max-w-[40rem]">
          <div className="relative aspect-[16/9] w-full">
            <EmptyMediaSlot className="absolute inset-0 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto w-full px-4 pb-3 pt-4 sm:px-7 sm:pb-4 md:pb-5">
        <p className={cn(ui.eyebrow, "mb-2")}>Selected for your profile</p>
        <motion.h1
          key={profile + copy.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: heroEase }}
          className="max-w-[22ch] text-[1.35rem] font-semibold leading-[1.12] tracking-tight text-[#f4f7fc] sm:max-w-xl sm:text-[clamp(1.45rem,3.5vw+0.5rem,1.95rem)]"
        >
          {copy.title}
        </motion.h1>
        <p className={cn(ui.body, "mt-2.5 max-w-prose text-[#c8ced8]")}>{copy.subtitle}</p>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: heroEase }}
          className="mt-5 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap"
        >
          <Link
            href="/search"
            className="inline-flex min-h-[36px] w-full items-center justify-center rounded-full bg-[#eef1f7] px-3.5 py-2 text-[11px] font-semibold leading-tight tracking-tight text-[#0b0c0f] transition hover:bg-white sm:w-auto"
          >
            {copy.cta}
          </Link>
          <Link
            href={product ? `/product/${product.id}` : "/product/tv-aurora-oled-65"}
            className={cn(
              "inline-flex min-h-[36px] w-full items-center justify-center rounded-full px-3.5 py-2 text-[11px] font-semibold leading-tight tracking-tight text-[#eef1f6] transition sm:w-auto",
              ui.surfaceInset,
              "border-white/[0.08] bg-[#0c1018]/90 hover:bg-[#121a26]/95"
            )}
          >
            View featured
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
