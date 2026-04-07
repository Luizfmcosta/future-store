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

export function CompareModule() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const { locale } = useLocale();
  const t = useT();
  const id = experienceCtx?.compareProductId ?? (profile === "marina" ? "sp-home-theater" : "sp-era-100");
  const product = getProductByIdLocalized(id, locale);
  if (!product) return null;

  const heroSrc = hasMediaUrl(product.heroImage) ? product.heroImage : null;

  return (
    <section className="flex flex-col bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease }}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f5f5]"
      >
        {heroSrc ? (
          <Image src={heroSrc} alt="" fill className="object-contain p-6 sm:p-10" sizes="100vw" unoptimized />
        ) : (
          <EmptyMediaSlot className="absolute inset-0" variant="light" />
        )}
      </motion.div>

      <motion.div
        variants={{ hidden: {}, show: stagger }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col px-5 py-10 sm:px-6"
      >
        <motion.div variants={fadeUp}>
          <EyebrowPill>{product.brand}</EyebrowPill>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="mt-3.5 whitespace-pre-line font-[family-name:var(--font-display)] text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.15] tracking-[-0.02em] text-[#1a1a1a]"
        >
          {profile === "marina" ? t("compare.marinaHeadline") : t("compare.ricardoHeadline")}
        </motion.h2>

        <motion.p variants={fadeUp} className="mt-3 max-w-[38ch] text-[12px] font-light leading-[1.7] text-[#888]">
          {profile === "marina" ? t("compare.marinaBody") : t("compare.ricardoBody")}
        </motion.p>

        <motion.div variants={fadeUp}>
          <Link
            href={`/product/${product.id}`}
            className="mt-5 inline-flex h-10 w-fit items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-[11px] font-medium text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
          >
            {experienceCtx ? t(experienceCtx.experience.copy.compareCta) : t("compare.cta")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
