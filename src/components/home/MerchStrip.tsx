"use client";

import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useLocale } from "@/context/LocaleContext";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { products } from "@/data/products";
import { sortProducts } from "@/lib/catalogSort";
import { localizeProducts } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { hasMediaUrl } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

export function MerchStrip() {
  const { locale } = useLocale();
  const t = useT();
  const experienceCtx = useShopperExperienceOptional();
  const items = useMemo(() => {
    const base = products.filter((p) => p.category !== "accessory");
    const sorted = experienceCtx
      ? sortProducts(base, experienceCtx.experience.merchSort)
      : base;
    return localizeProducts(sorted.slice(0, 7), locale);
  }, [locale, experienceCtx?.experience.merchSort]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section ref={ref} className="flex flex-col bg-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease }}
        className="flex flex-col items-center px-5 pt-10 text-center sm:px-6"
      >
        <EyebrowPill>
          {experienceCtx ? t(experienceCtx.experience.copy.merchEyebrow) : t("common.ourProducts")}
        </EyebrowPill>
        <h2 className="mt-3.5 font-[family-name:var(--font-display)] text-[clamp(1.3rem,4vw,1.8rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[#1a1a1a]">
          {experienceCtx ? t(experienceCtx.experience.copy.merchLine1) : t("merch.headlineLine1")}
          <br />
          {experienceCtx ? t(experienceCtx.experience.copy.merchLine2) : t("merch.headlineLine2")}
        </h2>
      </motion.div>

      <div className="relative mt-5 min-w-0 pb-10">
        <div className="flex w-full min-w-0 snap-x snap-mandatory gap-3.5 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth touch-pan-x pl-5 pr-0 scroll-pl-5 sm:pl-6 sm:scroll-pl-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {items.map((p, i) => {
            const heroSrc = hasMediaUrl(p.heroImage) ? p.heroImage : null;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.12 + i * 0.06, ease }}
                className="relative flex w-[60%] max-w-[220px] shrink-0 snap-start flex-col sm:w-[48%]"
              >
                <span className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a1a] text-[10px] font-medium tabular-nums text-white">
                  {i + 1}
                </span>

                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
                  {heroSrc ? (
                    <Image
                      src={heroSrc}
                      alt=""
                      fill
                      className="object-contain p-4 transition-transform duration-700 ease-out hover:scale-105"
                      sizes="60vw"
                      unoptimized
                    />
                  ) : (
                    <EmptyMediaSlot className="absolute inset-0 rounded-xl" variant="light" />
                  )}
                </div>

                <h3 className="mt-2.5 text-[11px] font-medium leading-snug text-[#1a1a1a]">
                  {p.title.split("—")[0].trim()}
                </h3>

                <div className="mt-2 flex items-center gap-1.5">
                  <Link
                    href={`/product/${p.id}`}
                    className="flex h-7 items-center justify-center rounded-full bg-[#1a1a1a] px-3 text-[10px] font-medium text-white transition-transform duration-200 hover:scale-[1.02]"
                  >
                    {t("common.buyNow")}
                  </Link>
                  <Link
                    href={`/product/${p.id}`}
                    className="flex h-7 items-center justify-center rounded-full border border-[#ddd] px-3 text-[10px] font-medium text-[#1a1a1a] transition-all duration-200 hover:border-[#999]"
                  >
                    {t("common.explore")}
                  </Link>
                </div>
              </motion.div>
            );
          })}
          <span aria-hidden className="w-5 shrink-0 snap-none sm:w-6" />
        </div>
      </div>
    </section>
  );
}
