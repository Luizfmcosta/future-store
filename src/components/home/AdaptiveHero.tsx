"use client";

import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { heroCopy } from "@/lib/copy";
import { getProductById } from "@/data/products";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL, hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroEase = [0.22, 1, 0.36, 1] as const;

export function AdaptiveHero() {
  const profile = useDemoStore((s) => s.activeProfile);
  const copy = heroCopy(profile);
  const featuredId = profile === "marina" ? "tv-aurora-oled-65" : "tv-pulse-led-55";
  const product = getProductById(featuredId);

  const heroSrc = product && hasMediaUrl(product.heroImage) ? product.heroImage : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: heroEase }}
      className={cn(
        "relative isolate flex min-h-0 flex-col overflow-hidden rounded-[1.75rem]",
        "border border-white/[0.09] bg-[#080a0e]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_28px_90px_-40px_rgba(0,0,0,0.75),0_0_80px_-20px_rgba(56,189,248,0.06)]",
      )}
    >
      {/* Ambient depth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(120,180,255,0.09),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(139,92,246,0.05),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_28%,rgba(0,0,0,0.35)_100%)]"
        aria-hidden
      />

      {/* Media frame */}
      <div className="relative z-[1] px-4 pt-5 sm:px-6 sm:pt-6">
        <div className="relative mx-auto w-full max-w-lg">
          <div
            className={cn(
              "relative aspect-[16/10] w-full overflow-hidden rounded-2xl",
              "ring-1 ring-white/[0.1] ring-inset",
              "shadow-[0_20px_50px_-28px_rgba(0,0,0,0.85)]",
            )}
          >
            {heroSrc ? (
              <Image
                src={heroSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 28rem"
                priority
                unoptimized
              />
            ) : (
              <EmptyMediaSlot className="absolute inset-0" />
            )}
            <div
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,10,14,0.92)_0%,rgba(8,10,14,0.25)_38%,transparent_62%)]"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Copy + actions */}
      <div className="relative z-[2] flex flex-1 flex-col px-4 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
        <p
          className={cn(
            ui.eyebrow,
            "mb-2.5 text-[9px] tracking-[0.24em] text-[#7d8a9c]",
          )}
        >
          Selected for your profile
        </p>

        <motion.h1
          key={profile + copy.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: heroEase }}
          className="max-w-[20ch] text-[1.5rem] font-semibold leading-[1.08] tracking-[-0.02em] text-[#fafbfc] sm:max-w-2xl sm:text-[clamp(1.55rem,4vw+0.4rem,2.05rem)]"
        >
          {copy.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.04, ease: heroEase }}
          className={cn(
            ui.body,
            "mt-3 max-w-[36ch] text-[13px] leading-relaxed text-[#a8b2c3] sm:max-w-prose",
          )}
        >
          {copy.subtitle}
        </motion.p>

        {product ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-white/[0.06] pt-4"
          >
            {product.inches ? (
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5c6b7e]">Size</p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-[#e8ecf4]">{product.inches}"</p>
              </div>
            ) : null}
            {product.technology ? (
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5c6b7e]">Panel</p>
                <p className="mt-0.5 text-sm font-semibold text-[#e8ecf4]">{product.technology}</p>
              </div>
            ) : null}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5c6b7e]">From</p>
              <p className="mt-0.5 text-base font-semibold tabular-nums tracking-tight text-[#f4f7fc]">
                {formatBRL(product.price)}
              </p>
            </div>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.1, ease: heroEase }}
          className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Link
            href="/search"
            className={cn(
              "group inline-flex min-h-[42px] w-full items-center justify-center gap-1.5 rounded-full px-5 text-[12px] font-semibold tracking-tight text-[#0a0c0e] transition",
              "bg-[linear-gradient(180deg,#f8fafc_0%,#e8ecf4_100%)]",
              "shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_8px_32px_-8px_rgba(0,0,0,0.45)]",
              "hover:brightness-105 active:scale-[0.99] sm:w-auto",
              ui.focusRing,
              "focus-visible:rounded-full",
            )}
          >
            {copy.cta}
            <ArrowUpRight className="size-3.5 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </Link>
          <Link
            href={product ? `/product/${product.id}` : "/product/tv-aurora-oled-65"}
            className={cn(
              "inline-flex min-h-[42px] w-full items-center justify-center rounded-full border border-white/[0.12] px-5 text-[12px] font-semibold tracking-tight text-[#eef2f8] transition sm:w-auto",
              "bg-white/[0.04] backdrop-blur-md hover:border-white/[0.18] hover:bg-white/[0.07]",
              ui.focusRing,
              "focus-visible:rounded-full",
            )}
          >
            View featured product
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
