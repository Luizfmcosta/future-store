"use client";

import { EmptyMediaSlot } from "@/components/shared/EmptyMediaSlot";
import { useLocale } from "@/context/LocaleContext";
import { getSpeakersAndSoundbars } from "@/data/products";
import { localizeProducts } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { formatBRL, hasMediaUrl } from "@/lib/utils";
import { useShopperExperienceOptional } from "@/context/ShopperExperienceContext";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.06 };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

function shortTitle(p: Product) {
  return p.title.split("—")[0].trim();
}

function MarinaCompareCard({
  product,
  tierLabel,
}: {
  product: Product;
  tierLabel: string;
}) {
  const t = useT();
  const heroSrc = hasMediaUrl(product.heroImage) ? product.heroImage : null;
  const blurb = product.bestFor[0] ?? product.reviewStrengths[0];

  return (
    <motion.article
      variants={fadeUp}
      className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_8px_28px_-18px_rgba(0,0,0,0.12)]"
    >
      <div className="border-b border-stone-100 bg-stone-50/90 px-3 py-2 sm:px-4">
        <p className="text-[12px] font-medium leading-snug text-stone-600">{tierLabel}</p>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        <div className="relative mx-auto h-36 w-full max-w-[220px] shrink-0 overflow-hidden rounded-xl bg-[#f5f5f5] sm:mx-0 sm:h-[7.5rem] sm:w-[7.5rem] sm:max-w-none">
          {heroSrc ? (
            <Image
              src={heroSrc}
              alt=""
              fill
              className="object-contain p-3"
              sizes="(max-width: 480px) 220px, 120px"
              unoptimized
            />
          ) : (
            <EmptyMediaSlot className="absolute inset-0" variant="light" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-[#1a1a1a]">
                {shortTitle(product)}
              </h3>
              <span className="shrink-0 text-[13px] font-semibold tabular-nums text-stone-900">
                {formatBRL(product.price)}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] font-light leading-relaxed text-stone-500 line-clamp-3">{blurb}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/product/${product.id}`}
              className="flex h-9 min-h-0 flex-1 items-center justify-center rounded-full border border-stone-200/90 text-[10px] font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              {t("common.explore")}
            </Link>
            <Link
              href={`/product/${product.id}`}
              className="flex h-9 min-h-0 flex-1 items-center justify-center rounded-full bg-[#1a1a1a] text-[10px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("common.buyNow")}
            </Link>
          </div>
        </div>
        </div>
      </div>
    </motion.article>
  );
}

function RicardoPickCard({ product }: { product: Product }) {
  const t = useT();
  const heroSrc = hasMediaUrl(product.heroImage) ? product.heroImage : null;
  const blurb = product.reviewStrengths[0];

  return (
    <motion.article
      variants={fadeUp}
      className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_8px_28px_-18px_rgba(0,0,0,0.12)]"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#f5f5f5]">
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt=""
            fill
            className="object-contain p-4"
            sizes="(max-width: 480px) 100vw, 400px"
            unoptimized
          />
        ) : (
          <EmptyMediaSlot className="absolute inset-0" variant="light" />
        )}
      </div>
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <div>
          <h3 className="text-[13px] font-medium leading-snug text-[#1a1a1a]">{shortTitle(product)}</h3>
          <p className="mt-1 text-[11px] font-light leading-relaxed text-stone-500 line-clamp-2">{blurb}</p>
          <p className="mt-2 text-[12px] font-semibold tabular-nums text-stone-900">{formatBRL(product.price)}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="flex h-9 flex-1 items-center justify-center rounded-full border border-stone-200/90 text-[10px] font-medium text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50"
          >
            {t("common.explore")}
          </Link>
          <Link
            href={`/product/${product.id}`}
            className="flex h-9 flex-1 items-center justify-center rounded-full bg-[#1a1a1a] text-[10px] font-medium text-white transition-transform hover:scale-[1.02]"
          >
            {t("common.buyNow")}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function CuratedForYou() {
  const profile = useDemoStore((s) => s.activeProfile);
  const experienceCtx = useShopperExperienceOptional();
  const { locale } = useLocale();
  const t = useT();

  const pair = useMemo(() => {
    const catalog = getSpeakersAndSoundbars();
    const mode = experienceCtx?.experience.curatedSort ?? "profile_default";
    let sorted: typeof catalog;
    if (mode === "price_desc") {
      sorted = [...catalog].sort((a, b) => b.price - a.price || a.id.localeCompare(b.id));
    } else if (mode === "price_asc") {
      sorted = [...catalog].sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
    } else {
      sorted =
        profile === "marina"
          ? [...catalog].sort((a, b) => b.price - a.price || a.id.localeCompare(b.id))
          : [...catalog].sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
    }
    return localizeProducts(sorted.slice(0, 2), locale);
  }, [profile, locale, experienceCtx?.experience.curatedSort]);

  return (
    <section className="flex flex-col bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease }}
        className="flex flex-col items-center px-4 pb-6 pt-8 text-center sm:px-6 sm:pb-7 sm:pt-9"
      >
        <h2 className="max-w-[min(100%,22rem)] whitespace-pre-line font-[family-name:var(--font-display)] text-[clamp(1.15rem,3.2vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]">
          {profile === "marina" ? t("curated.marinaHeadline") : t("curated.ricardoHeadline")}
        </h2>
        <p className="mt-2.5 max-w-[min(100%,26rem)] text-[11.5px] font-light leading-[1.65] text-stone-500 sm:text-[12px]">
          {profile === "marina" ? t("curated.marinaBody") : t("curated.ricardoBody")}
        </p>
      </motion.div>

      <motion.div
        variants={{ hidden: {}, show: stagger }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
        className="flex flex-col gap-3 px-4 pb-9 sm:px-6 sm:pb-10"
      >
        {profile === "marina" ? (
          <>
            {pair.map((p, i) => (
              <MarinaCompareCard
                key={p.id}
                product={p}
                tierLabel={i === 0 ? t("curated.marinaTierA") : t("curated.marinaTierB")}
              />
            ))}
          </>
        ) : (
          pair.map((p) => <RicardoPickCard key={p.id} product={p} />)
        )}
      </motion.div>
    </section>
  );
}
