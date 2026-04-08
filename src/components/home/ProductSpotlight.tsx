"use client";

import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useLocale } from "@/context/LocaleContext";
import { getProductByIdLocalized } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { cn, hasMediaUrl } from "@/lib/utils";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.08 };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** Editorial diagram for Marina spotlight (“how to choose” home theater layout). */
const MARINA_SPOTLIGHT_DIAGRAM_SRC = "/media/home/home-theater-room-diagram.png";

export function ProductSpotlight() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const { locale } = useLocale();
  const t = useT();
  const id =
    experienceCtx?.spotlightProductId ??
    (profile === "marina" ? "sp-move-2" : profile === "joana" ? "sp-five" : "sp-era-100");
  const product = getProductByIdLocalized(id, locale);
  if (!product) return null;

  const isMarinaGuide = profile === "marina";
  const heroSrc = isMarinaGuide
    ? MARINA_SPOTLIGHT_DIAGRAM_SRC
    : hasMediaUrl(product.heroImage)
      ? product.heroImage
      : null;
  const eyebrow = isMarinaGuide
    ? t("spotlight.marinaEyebrow")
    : product.category === "tv"
      ? t("common.tvs")
      : t("common.sound");
  const headline = isMarinaGuide ? t("spotlight.marinaHeadline") : product.title.split("—")[0].trim();
  const body = isMarinaGuide
    ? t("spotlight.marinaBody")
    : `${product.reviewStrengths[0]}. ${product.reviewStrengths.slice(1).join(". ")}.`;
  const imageAlt = isMarinaGuide ? t("spotlight.marinaImageAlt") : "";
  const ctaLabel = experienceCtx
    ? t(experienceCtx.experience.copy.spotlightCta)
    : isMarinaGuide
      ? t("spotlight.marinaCta")
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
        <h2 className="mt-3.5 max-w-[40ch] font-[family-name:var(--font-display)] text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#1a1a1a]">
          {headline}
        </h2>
        <p className="mt-2.5 max-w-[min(100%,42ch)] text-[12px] font-light leading-[1.7] text-[#888]">{body}</p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.97 },
          show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
        }}
        className="px-5 pt-5 sm:px-6"
      >
        <div
          className={cn(
            "relative w-full overflow-hidden bg-[#f5f5f5]",
            isMarinaGuide
              ? "aspect-[2/1] min-h-[11rem] sm:min-h-[14rem] rounded-xl"
              : "aspect-[16/10] rounded-xl",
          )}
        >
          {heroSrc ? (
            <Image
              src={heroSrc}
              alt={imageAlt}
              fill
              className={cn(isMarinaGuide ? "object-cover object-center" : "object-contain p-4 sm:p-6")}
              sizes="100vw"
              unoptimized
            />
          ) : (
            <EmptyMediaSlot className="absolute inset-0 rounded-xl" variant="light" />
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="px-5 pb-10 pt-4 sm:px-6">
        <Link
          href={`/product/${product.id}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-[11px] font-medium text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
        >
          {ctaLabel}
        </Link>
      </motion.div>
    </motion.section>
  );
}
