"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { RICARDO_TIKTOK_CLIPS } from "@/data/ricardoTiktokClips";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * oEmbed TikTok: min-width 325px (docs). Altura ~708px é o chrome típico do embed v2
 * (abaixo disso o iframe ganha scroll interno).
 */
const EMBED_W = 325;
const EMBED_H = 708;

/** Mobile: cartão mais estreito que o iframe; escala uniforme (altura do shell = iframe × scale). */
const CARD_W_MOBILE = 240;
const MOBILE_SCALE = CARD_W_MOBILE / EMBED_W;
const MOBILE_SHELL_H = Math.round(EMBED_H * MOBILE_SCALE);

function TikTokFrame({ videoId, title }: { videoId: string; title: string }) {
  const src = `https://www.tiktok.com/embed/v2/${videoId}`;
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl bg-[#0f0f0f]",
        "ring-0 outline-none",
        "w-[240px] md:w-[325px]",
        "h-[var(--shell)] md:h-[var(--embed-h)]",
      )}
      style={{
        ["--shell" as string]: `${MOBILE_SHELL_H}px`,
        ["--embed-h" as string]: `${EMBED_H}px`,
        ["--mobile-scale" as string]: String(MOBILE_SCALE),
      }}
    >
      {/* Mobile: escala = CARD_W_MOBILE / EMBED_W; md: iframe 1:1 no cartão */}
      <div
        className={cn(
          "absolute left-1/2 top-0 origin-top",
          "max-md:[transform:translateX(-50%)_scale(var(--mobile-scale))]",
          "md:relative md:left-0 md:top-0 md:translate-x-0 md:scale-100 md:transform-none",
        )}
      >
        <iframe
          title={title}
          src={src}
          width={EMBED_W}
          height={EMBED_H}
          className="block border-0 bg-transparent outline-none ring-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}

export function RicardoTikTokCarousel() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section ref={ref} className="bg-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease }}
        className="mx-auto max-w-[1200px] min-w-0 px-5 pb-10 pt-9 sm:px-6 sm:pb-12 sm:pt-10"
      >
        <EyebrowPill>{t("ricardoTiktok.eyebrow")}</EyebrowPill>
        <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[clamp(1.1rem,3.2vw,1.35rem)] font-medium leading-snug tracking-[-0.02em] text-stone-900">
          {t("ricardoTiktok.title")}
        </h2>
        <p className="mt-1 max-w-[46ch] text-[11px] font-light leading-relaxed text-stone-400 sm:text-[12px]">
          {t("ricardoTiktok.subline")}
        </p>

        <div className="relative mt-6 min-w-0 -mx-5 sm:mx-0">
          <div
            className={cn(
              "overflow-x-auto overflow-y-hidden overscroll-x-contain",
              "scroll-smooth touch-pan-x pl-5 pr-6 sm:pl-0 sm:pr-0",
              "scrollbar-none",
            )}
          >
            <div className="flex w-max snap-x snap-mandatory gap-3.5 sm:gap-5">
              {RICARDO_TIKTOK_CLIPS.map((clip) => (
                <article key={clip.videoId} className="shrink-0 snap-start">
                  <TikTokFrame videoId={clip.videoId} title={t("ricardoTiktok.embedTitle")} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
