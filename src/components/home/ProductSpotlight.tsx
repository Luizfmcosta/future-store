"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { getProductByIdLocalized } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { cn, hasMediaUrl } from "@/lib/utils";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.08 };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Muted loop for Marina spotlight (“how to choose” home theater layout). */
const MARINA_SPOTLIGHT_VIDEO_SRC = "/media/home/marina-how-to-choose.mp4";

export function ProductSpotlight() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const t = useT();
  const id =
    experienceCtx?.spotlightProductId ??
    (profile === "marina" ? "sp-move-2" : "sp-era-100");
  const product = getProductByIdLocalized(id);
  const isMarinaGuide = profile === "marina";
  const isRicardoSpotlight = profile === "ricardo";
  const marinaVideoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <motion.section
      variants={{ hidden: {}, show: stagger }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-col bg-white"
    >
      <motion.div variants={fadeUp} className="flex flex-col px-5 pt-10 sm:px-6">
        <EyebrowPill>{eyebrow}</EyebrowPill>
        <h2 className="mt-3.5 max-w-[40ch] text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#1a1a1a]">
          {headline}
        </h2>
        <p className="mt-2.5 max-w-[min(100%,42ch)] text-[15px] font-light leading-[1.65] text-[#888] sm:text-[17px]">{body}</p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.97 },
          show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
        }}
        className="px-5 pt-5 sm:px-6"
      >
        <AskImageButton
          productLabel={product.title}
          productId={product.id}
          className={cn(
            "w-full overflow-hidden bg-[#f5f5f5]",
            isMarinaGuide || isRicardoSpotlight
              ? "aspect-[2/1] min-h-[11rem] sm:min-h-[14rem] rounded-xl"
              : "aspect-[16/10] rounded-xl",
          )}
        >
          {isMarinaGuide ? (
            <video
              ref={marinaVideoRef}
              className="absolute inset-0 h-full w-full object-cover object-center"
              src={MARINA_SPOTLIGHT_VIDEO_SRC}
              muted
              playsInline
              loop
              autoPlay
              aria-label={imageAlt}
            />
          ) : heroSrc ? (
            <div className="relative h-full w-full">
              <Image
                src={heroSrc}
                alt=""
                fill
                className={cn(
                  isRicardoSpotlight ? "object-cover object-center" : "object-contain p-4 sm:p-6",
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

      <motion.div variants={fadeUp} className="px-5 pb-10 pt-4 sm:px-6">
        <Link
          href={`/product/${product.id}`}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-[15px] font-medium text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] sm:text-[16px]"
        >
          {ctaLabel}
        </Link>
      </motion.div>
    </motion.section>
  );
}
