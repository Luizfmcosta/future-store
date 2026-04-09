"use client";

import { getCheapestPromoSpeaker } from "@/data/products";
import { useT } from "@/lib/useT";
import { cn, formatBRL } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

/** Lifestyle — portable speakers (copy over full-bleed looped video). */
const HERO_VIDEO = "/media/home/ricardo-promo-hero-portable-speakers.mp4";

const ease = [0.76, 0, 0.24, 1] as const;
const stagger = { staggerChildren: 0.14, delayChildren: 1.5 };
const child = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

function ricardoHeadlineLines(headline: string): string[] {
  return headline
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Texto contínuo para o modo uma linha (largura de container confortável). */
function ricardoHeadlineOneLine(lines: string[]): string {
  return lines.join(" ");
}

export function RicardoPromoHero() {
  const t = useT();
  const cheapest = getCheapestPromoSpeaker();
  const fromPrice = cheapest ? formatBRL(cheapest.price) : "—";
  const headlineLines = ricardoHeadlineLines(t("hero.ricardoPromo.headline"));
  const headlineOneLine = ricardoHeadlineOneLine(headlineLines);

  return (
    <section id="home-hero" className="relative flex flex-col">
      <div className="relative flex h-[93vh] min-h-[93vh] w-full shrink-0 flex-col overflow-hidden bg-[#0a0a0a]">
        <div className="pointer-events-none absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover object-[center_28%] opacity-90"
            aria-hidden
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000]"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-end px-4 pb-28 pt-24 sm:justify-center sm:px-6 sm:pb-16 sm:pt-20">
          <motion.div
            variants={{ hidden: {}, show: stagger }}
            initial="hidden"
            animate="show"
            className="@container flex w-full max-w-[min(28rem,calc(100cqw-2rem))] translate-y-6 flex-col items-center text-center"
          >
            <motion.p
              variants={child}
              className="max-w-full text-[16px] font-normal tracking-normal text-white/70 @min-[480px]:text-[17px]"
            >
              {t("hero.ricardoPromo.kicker")}
            </motion.p>
            <motion.h1
              variants={child}
              className="mt-2 w-full min-w-0 font-medium tracking-[-0.02em] text-white"
            >
              {/*
               * Query no próprio bloco (@container no pai): &lt; ~24rem = duas linhas;
               * ≥ ~24rem = uma linha com nowrap e clamp em cqw deste bloco (não no viewport).
               */}
              <span className="block @min-[24rem]:hidden">
                {headlineLines.map((line, i) => (
                  <span
                    key={i}
                    className={cn(
                      "block hyphens-none text-[clamp(1.78rem,6.6cqw,2.62rem)] leading-[1.12]",
                      i > 0 && "mt-[0.28em]",
                    )}
                  >
                    {line}
                  </span>
                ))}
              </span>
              <span className="hidden min-w-0 max-w-full text-center hyphens-none @min-[24rem]:block @min-[24rem]:whitespace-nowrap @min-[24rem]:text-[38px] @min-[24rem]:leading-[1.04]">
                {headlineOneLine}
              </span>
            </motion.h1>
            <motion.p
              variants={child}
              className="mt-2 text-[22px] font-semibold tabular-nums text-white @min-[480px]:text-[24px]"
            >
              <span className="font-normal text-white/75">{t("hero.ricardoPromo.fromLabel")} </span>
              {fromPrice}
            </motion.p>

            <motion.div variants={child} className="mt-5 flex w-full justify-center">
              <Link
                href="/search"
                className="inline-flex h-12 min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-[#0c0c0c] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)] transition-transform hover:scale-[1.02] active:scale-[0.98] @min-[480px]:text-[16px] sm:w-auto sm:min-w-[9.5rem]"
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
