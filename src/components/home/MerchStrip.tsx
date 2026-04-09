"use client";

import { AskImageButton } from "@/components/shared/AskImageButton";
import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { products } from "@/data/products";
import { sortProducts } from "@/lib/catalogSort";
import { localizeProducts } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { hasMediaUrl } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

export function MerchStrip() {
  const t = useT();
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const isRicardoPromoFirstVisit =
    profile === "ricardo" &&
    experienceCtx?.experience.segment === "ricardo_speed" &&
    !experienceCtx.signals.isReturning;

  const items = useMemo(() => {
    let base = products.filter((p) => p.category !== "accessory");
    if (isRicardoPromoFirstVisit) {
      base = base.filter((p) => p.category === "tv" && p.price <= 5000);
    }
    const sorted = experienceCtx
      ? sortProducts(base, experienceCtx.experience.merchSort)
      : base;
    return localizeProducts(sorted.slice(0, 10));
  }, [experienceCtx?.experience.merchSort, isRicardoPromoFirstVisit, experienceCtx]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section ref={ref} className="flex flex-col bg-white pb-12 sm:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease }}
        className="flex flex-col items-center px-5 pt-10 text-center sm:px-6"
      >
        <EyebrowPill>
          {experienceCtx ? t(experienceCtx.experience.copy.merchEyebrow) : t("common.ourProducts")}
        </EyebrowPill>
        <h2 className="mt-3.5 text-[clamp(1.38rem,4.1vw,1.9rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[#1a1a1a]">
          {experienceCtx ? t(experienceCtx.experience.copy.merchLine1) : t("merch.headlineLine1")}
          <br />
          {experienceCtx ? t(experienceCtx.experience.copy.merchLine2) : t("merch.headlineLine2")}
        </h2>
        {isRicardoPromoFirstVisit ? (
          <p className="mt-2 max-w-[40ch] text-[15px] font-medium leading-snug text-stone-500 sm:text-[16px]">
            {t("merch.ricardoVolumeLine")}
          </p>
        ) : null}
      </motion.div>

      <div className="relative mt-5 min-w-0">
        <div className="flex w-full min-w-0 snap-x snap-mandatory gap-3.5 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth touch-pan-x scrollbar-none pl-5 pr-0 scroll-pl-5 sm:pl-6 sm:scroll-pl-6">
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
                <span className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] text-[13px] font-medium tabular-nums text-white">
                  {i + 1}
                </span>

                <AskImageButton
                  productLabel={p.title}
                  productId={p.id}
                  className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f5f5f5]"
                >
                  {heroSrc ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={heroSrc}
                        alt=""
                        fill
                        className="object-contain p-4 transition-transform duration-700 ease-out hover:scale-105"
                        sizes="60vw"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <EmptyMediaSlot className="relative min-h-[10rem] rounded-xl" variant="light" />
                  )}
                </AskImageButton>

                <h3 className="mt-2.5 text-[15px] font-medium leading-snug text-[#1a1a1a]">
                  {p.title.split("—")[0].trim()}
                </h3>

                <div className="mt-2 flex items-center gap-1.5">
                  <Link
                    href={`/product/${p.id}`}
                    className="flex h-9 min-h-9 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] px-4 text-[14px] font-medium text-white transition-transform duration-200 hover:scale-[1.02] sm:text-[15px]"
                  >
                    {t("common.buyNow")}
                  </Link>
                  <Link
                    href={`/product/${p.id}`}
                    className="flex h-9 min-h-9 shrink-0 items-center justify-center rounded-full border border-[#ddd] px-4 text-[14px] font-medium text-[#1a1a1a] transition-all duration-200 hover:border-[#999] sm:text-[15px]"
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
