"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { getProductByIdLocalized } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn, hasMediaUrl } from "@/lib/utils";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.08 };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const mediaReveal = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
};

/** Muted loop for Marina spotlight (“how to choose” home theater layout). */
const MARINA_SPOTLIGHT_VIDEO_SRC = "/media/home/marina-how-to-choose.mp4";

export function ProductSpotlight() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const t = useT();
  const id =
    experienceCtx?.spotlightProductId ??
    (profile === "marina" ? "sp-move-2" : profile === "ricardo" ? "sp-five" : "sp-era-100");
  const product = getProductByIdLocalized(id);
  const isMarinaGuide = profile === "marina";
  const isRicardoSpotlight = profile === "ricardo";
  const marinaVideoRef = useRef<HTMLVideoElement>(null);
  const [marinaVideoFallback, setMarinaVideoFallback] = useState(false);

  useEffect(() => {
    setMarinaVideoFallback(false);
  }, [isMarinaGuide, id]);

  useEffect(() => {
    if (!isMarinaGuide) return;
    const el = marinaVideoRef.current;
    if (!el) return;
    el.play().catch(() => {
      /* muted + playsInline usually allows autoplay; ignore if blocked */
    });
  }, [isMarinaGuide, id]);

  if (!product) return null;

  const heroSrc = !isMarinaGuide && hasMediaUrl(product.heroImage) ? product.heroImage : null;
  /** Poster + MP4 load error fallback (e.g. asset missing in env). */
  const marinaPosterSrc =
    isMarinaGuide && hasMediaUrl(product.heroImage) ? product.heroImage : null;
  const eyebrow = isMarinaGuide
    ? t("spotlight.marinaEyebrow")
    : isRicardoSpotlight
      ? t("spotlight.ricardoEyebrow")
      : product.category === "tv"
        ? t("common.tvs")
        : t("common.sound");
  const headline = isMarinaGuide
    ? t("spotlight.marinaHeadline")
    : isRicardoSpotlight
      ? t("spotlight.ricardoHeadline")
      : product.title.split("—")[0].trim();
  const body = isMarinaGuide
    ? t("spotlight.marinaBody")
    : isRicardoSpotlight
      ? t("spotlight.ricardoBody")
      : `${product.reviewStrengths[0]}. ${product.reviewStrengths.slice(1).join(". ")}.`;
  const imageAlt = isMarinaGuide ? t("spotlight.marinaImageAlt") : "";
  const ctaLabel = experienceCtx
    ? t(experienceCtx.experience.copy.spotlightCta)
    : isMarinaGuide
      ? t("spotlight.marinaCta")
      : isRicardoSpotlight
        ? t("spotlight.ricardoCta")
        : t("common.explore");

  const mediaFrameClass = cn(
    "w-full overflow-hidden",
    isMarinaGuide ? "bg-white" : "bg-[#f5f5f5]",
    isMarinaGuide || isRicardoSpotlight
      ? "aspect-[2/1] min-h-[11rem] sm:min-h-[14rem] rounded-xl"
      : "aspect-[16/10] rounded-xl",
  );

  return (
    <motion.section
      variants={{ hidden: {}, show: stagger }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className={cn("flex flex-col bg-white", ui.home.whiteSectionOnDarkCanvas)}
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6">
        {isMarinaGuide ? (
          <motion.div variants={mediaReveal} className="pt-10">
            <AskImageButton
              productLabel={product.title}
              productId={product.id}
              className={cn(mediaFrameClass, "relative isolate")}
            >
              {marinaVideoFallback && marinaPosterSrc ? (
                <div className="absolute inset-0 z-0 min-h-0 w-full bg-[#f5f5f5]">
                  <Image
                    src={marinaPosterSrc}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    unoptimized
                  />
                </div>
              ) : marinaVideoFallback ? (
                <EmptyMediaSlot className="absolute inset-0 z-0 min-h-[11rem] rounded-xl sm:min-h-[14rem]" variant="light" />
              ) : (
                <video
                  ref={marinaVideoRef}
                  className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-50"
                  src={MARINA_SPOTLIGHT_VIDEO_SRC}
                  poster={marinaPosterSrc ?? undefined}
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="auto"
                  aria-label={imageAlt}
                  onError={() => setMarinaVideoFallback(true)}
                />
              )}
              <div
                className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/95 from-0% via-white/45 via-[28%] to-transparent to-[55%]"
                aria-hidden
              />
              <div className="relative z-[2] flex flex-col p-4 pt-5 sm:p-5 sm:pt-6">
                <EyebrowPill>{eyebrow}</EyebrowPill>
                <h2 className="mt-2 max-w-[40ch] text-balance text-pretty text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#1a1a1a]">
                  {headline}
                </h2>
                <p className="mt-2.5 max-w-[min(100%,44ch)] text-balance text-pretty text-[15px] font-normal leading-[1.65] text-[#888] sm:text-[17px]">
                  {body}
                </p>
              </div>
            </AskImageButton>
          </motion.div>
        ) : (
          <>
            <motion.div variants={fadeUp} className="flex flex-col pt-10">
              <EyebrowPill>{eyebrow}</EyebrowPill>
              <h2 className="mt-2 max-w-[40ch] text-balance text-pretty text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#1a1a1a]">
                {headline}
              </h2>
              <p className="mt-2.5 max-w-[min(100%,44ch)] text-balance text-pretty text-[15px] font-normal leading-[1.65] text-[#888] sm:text-[17px]">
                {body}
              </p>
            </motion.div>

            <motion.div variants={mediaReveal} className="pt-5">
              <AskImageButton productLabel={product.title} productId={product.id} className={mediaFrameClass}>
                {heroSrc ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={heroSrc}
                      alt=""
                      fill
                      className={cn(
                        "object-contain object-center",
                        isRicardoSpotlight ? "p-3 sm:p-5" : "p-4 sm:p-6",
                      )}
                      sizes="100vw"
                      unoptimized
                    />
                  </div>
                ) : (
                  <EmptyMediaSlot className="relative min-h-[10rem] rounded-xl" variant="light" />
                )}
              </AskImageButton>
            </motion.div>
          </>
        )}

        <motion.div variants={fadeUp} className="pb-10 pt-4">
          <Link
            href={`/product/${product.id}`}
            className={cn(
              ui.home.focusRing,
              ui.home.ctaPrimaryFill,
              "inline-flex h-11 items-center justify-center px-6 text-[15px] sm:text-[16px]",
            )}
          >
            {ctaLabel}
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
