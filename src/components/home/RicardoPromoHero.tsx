"use client";

import { getCheapestPromoSpeaker } from "@/data/products";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn, formatBRL } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

/** Lifestyle — caixa portátil (referência Sonos: texto à esquerda sobre imagem). */
const HERO_IMAGE = "/media/home/ricardo-promo-hero-speaker.png";

export function RicardoPromoHero() {
  const t = useT();
  const cheapest = getCheapestPromoSpeaker();
  const fromPrice = cheapest ? formatBRL(cheapest.price) : "—";

  return (
    <section id="home-hero" className="relative flex flex-col">
      <div className="relative flex min-h-[min(88svh,640px)] w-full flex-col overflow-hidden bg-[#0a0a0a] sm:min-h-[min(85svh,720px)]">
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

        <div className="relative z-10 flex min-h-[min(88svh,640px)] flex-col justify-end px-5 pb-28 pt-24 sm:min-h-[min(85svh,720px)] sm:justify-center sm:px-8 sm:pb-16 sm:pt-20 md:px-12">
          <div className="max-w-[min(100%,24rem)] text-left">
            <p className={cn(ui.eyebrow, "text-white/70")}>{t("hero.ricardoPromo.kicker")}</p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-[clamp(1.35rem,5.5vw,1.95rem)] font-semibold leading-[1.14] tracking-[-0.02em] text-white sm:text-[clamp(1.45rem,3.6vw,2.1rem)]">
              {t("hero.ricardoPromo.headline")}
            </h1>
            <p className="mt-2 max-w-[38ch] text-[12px] font-light leading-relaxed text-white/85 sm:text-[13px]">
              {t("hero.ricardoPromo.subhead")}
            </p>
            <p className="mt-3 text-[12px] font-semibold tabular-nums text-white sm:text-[13px]">
              <span className="font-normal text-white/75">{t("hero.ricardoPromo.fromLabel")} </span>
              {fromPrice}
            </p>

            <div className="mt-5">
              <Link
                href="/search"
                className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-white px-5 text-[12px] font-semibold text-[#0c0c0c] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:min-w-[9rem]"
              >
                {t("hero.ricardoPromo.cta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
