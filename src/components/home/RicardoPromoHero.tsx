"use client";

import { useLocale } from "@/context/LocaleContext";
import { getCheapestPromoSpeaker } from "@/data/products";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn, formatBRL } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/** Lifestyle — caixa portátil (referência Sonos: texto à esquerda sobre imagem). */
const HERO_IMAGE = "/media/home/ricardo-promo-hero-speaker.png";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.14, delayChildren: 1.5 };
const child = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

function formatPromoFromPrice(price: number, locale: string): string {
  if (locale === "en-US") {
    return `R$ ${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  return formatBRL(price);
}

export function RicardoPromoHero() {
  const t = useT();
  const { locale } = useLocale();
  const cheapest = getCheapestPromoSpeaker();
  const fromPrice = cheapest ? formatPromoFromPrice(cheapest.price, locale) : "—";

  return (
    <section id="home-hero" className="relative flex flex-col">
      <div className="relative flex h-[100vh] min-h-[100vh] w-full shrink-0 flex-col overflow-hidden bg-[#0a0a0a]">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            className="object-cover object-[center_28%]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10 sm:from-black/75 sm:via-black/35"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 sm:from-black/40" aria-hidden />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col items-start justify-end px-4 pb-28 pt-24 sm:justify-center sm:px-6 sm:pb-16 sm:pt-20">
          <motion.div
            variants={{ hidden: {}, show: stagger }}
            initial="hidden"
            animate="show"
            className="w-full max-w-[min(100%,24rem)] translate-y-6 text-left"
          >
            <motion.p variants={child} className={cn(ui.eyebrow, "text-white/70")}>
              {t("hero.ricardoPromo.kicker")}
            </motion.p>
            <motion.h1
              variants={child}
              className="mt-1 font-[family-name:var(--font-display)] text-[clamp(1.35rem,5.5vw,1.95rem)] font-semibold leading-[1.14] tracking-[-0.02em] text-white sm:text-[clamp(1.45rem,3.6vw,2.1rem)]"
            >
              {t("hero.ricardoPromo.headline")}
            </motion.h1>
            <motion.p
              variants={child}
              className="mt-2 max-w-[38ch] text-[12px] font-light leading-relaxed text-white/85 sm:text-[13px]"
            >
              {t("hero.ricardoPromo.subhead")}
            </motion.p>
            <motion.p
              variants={child}
              className="mt-3 text-[12px] font-semibold tabular-nums text-white sm:text-[13px]"
            >
              <span className="font-normal text-white/75">{t("hero.ricardoPromo.fromLabel")} </span>
              {fromPrice}
            </motion.p>

            <motion.div variants={child} className="mt-5">
              <Link
                href="/search"
                className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-white px-5 text-[12px] font-semibold text-[#0c0c0c] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:min-w-[9rem]"
              >
                {t("hero.ricardoPromo.cta")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
