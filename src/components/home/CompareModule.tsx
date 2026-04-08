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

export function CompareModule() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const { locale } = useLocale();
  const t = useT();
  const id =
    experienceCtx?.compareProductId ??
    (profile === "marina" ? "sb-arc-ultra" : profile === "joana" ? "sb-beam-g2" : "sb-ray");
  const product = getProductByIdLocalized(id, locale);
  if (!product) return null;

  const heroSrc = hasMediaUrl(product.heroImage) ? product.heroImage : null;

  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-10 sm:px-6 sm:py-12 @lg:flex-row @lg:items-center @lg:gap-10 @lg:py-14">
        <motion.div
          variants={{ hidden: {}, show: stagger }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex min-w-0 flex-1 flex-col items-start @lg:basis-1/2 @lg:py-2"
        >
          <motion.div variants={fadeUp}>
            <EyebrowPill>
              {profile === "marina"
                ? t("compare.marinaEyebrow")
                : profile === "ricardo"
                  ? t("compare.ricardoEyebrow")
                  : product.brand}
            </EyebrowPill>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-3.5 whitespace-pre-line text-left font-[family-name:var(--font-display)] text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.15] tracking-[-0.02em] text-[#1a1a1a]"
          >
            {profile === "marina"
              ? t("compare.marinaHeadline")
              : profile === "joana"
                ? t("compare.joanaHeadline")
                : t("compare.ricardoHeadline")}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-[40ch] text-left text-[12px] font-light leading-[1.7] text-[#888] sm:text-[13px]"
          >
            {profile === "marina"
              ? t("compare.marinaBody")
              : profile === "joana"
                ? t("compare.joanaBody")
                : t("compare.ricardoBody")}
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link
              href={`/product/${product.id}`}
              className="mt-5 inline-flex h-10 w-fit items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-[11px] font-medium text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] sm:text-[12px]"
            >
              {experienceCtx
                ? t(experienceCtx.experience.copy.compareCta)
                : profile === "marina"
                  ? t("compare.marinaCta")
                  : profile === "ricardo"
                    ? t("compare.ricardoCta")
                    : t("compare.cta")}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease }}
          className="w-full min-w-0 flex-1 @lg:basis-1/2"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
            {heroSrc ? (
              <Image
                src={heroSrc}
                alt=""
                fill
                className={cn(
                  profile === "ricardo" ? "object-cover object-center" : "object-contain p-5 sm:p-6",
                )}
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <EmptyMediaSlot className="absolute inset-0" variant="light" />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
