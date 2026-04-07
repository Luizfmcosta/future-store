"use client";

import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useLocale } from "@/context/LocaleContext";
import { getProductByIdLocalized } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { hasMediaUrl } from "@/lib/utils";
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

export function ProductSpotlight() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const { locale } = useLocale();
  const t = useT();
  const id = experienceCtx?.spotlightProductId ?? (profile === "marina" ? "sp-move-2" : "sp-era-100");
  const product = getProductByIdLocalized(id, locale);
  if (!product) return null;

  const heroSrc = hasMediaUrl(product.heroImage) ? product.heroImage : null;

  return (
    <motion.section
      variants={{ hidden: {}, show: stagger }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-col bg-white"
    >
      <motion.div variants={fadeUp} className="flex flex-col px-5 pt-10 sm:px-6">
        <EyebrowPill>{t("common.sound")}</EyebrowPill>
        <h2 className="mt-3.5 font-[family-name:var(--font-display)] text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#1a1a1a]">
          {product.title.split("—")[0].trim()}
        </h2>
        <p className="mt-2.5 max-w-[36ch] text-[12px] font-light leading-[1.7] text-[#888]">
          {product.reviewStrengths[0]}. {product.reviewStrengths.slice(1).join(". ")}.
        </p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.97 },
          show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
        }}
        className="px-5 pt-5 sm:px-6"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
          {heroSrc ? (
            <Image src={heroSrc} alt="" fill className="object-contain p-5" sizes="100vw" unoptimized />
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
          {experienceCtx ? t(experienceCtx.experience.copy.spotlightCta) : t("common.explore")}
        </Link>
      </motion.div>
    </motion.section>
  );
}
