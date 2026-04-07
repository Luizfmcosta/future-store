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

export function ContinueJourney() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const { locale } = useLocale();
  const t = useT();
  const id =
    experienceCtx?.continueProductId ?? (profile === "marina" ? "sp-era-300" : "sp-roam-2");
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
      <motion.div variants={fadeUp} className="px-5 pt-10 sm:px-6">
        <EyebrowPill>
          {product.category === "speaker" ? t("common.speakers") : t("common.audio")}
        </EyebrowPill>
      </motion.div>

      <motion.div variants={fadeUp} className="px-5 pt-3.5 sm:px-6">
        <h2 className="whitespace-pre-line font-[family-name:var(--font-display)] text-[clamp(1.35rem,4.2vw,1.85rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[#1a1a1a]">
          {experienceCtx ? t(experienceCtx.experience.copy.continueHeadline) : t("continueJourney.headline")}
        </h2>
        <p className="mt-2.5 font-[family-name:var(--font-display)] text-[clamp(1.05rem,3.2vw,1.25rem)] font-medium leading-snug tracking-[-0.015em] text-[#444]">
          {product.title.split("—")[0].trim()}
        </p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.97 },
          show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
        }}
        className="px-5 pt-5 sm:px-6"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
          {heroSrc ? (
            <Image src={heroSrc} alt="" fill className="object-contain p-5" sizes="100vw" unoptimized />
          ) : (
            <EmptyMediaSlot className="absolute inset-0" variant="light" />
          )}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col px-5 pb-10 pt-4 sm:px-6">
        <p className="max-w-[42ch] text-[12px] font-light leading-[1.7] text-[#888]">
          {experienceCtx
            ? t(experienceCtx.experience.copy.continueBody)
            : profile === "marina"
              ? t("continueJourney.marinaBody")
              : t("continueJourney.ricardoBody")}
        </p>

        <Link
          href={`/product/${product.id}`}
          className="mt-5 inline-flex h-10 w-fit items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-[11px] font-medium text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
        >
          {experienceCtx ? t(experienceCtx.experience.copy.continueCta) : t("continueJourney.exploreBrand", { brand: product.brand })}
        </Link>
      </motion.div>
    </motion.section>
  );
}
