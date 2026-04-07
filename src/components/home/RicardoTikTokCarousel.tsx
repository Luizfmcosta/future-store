"use client";

import { RICARDO_TIKTOK_CLIPS } from "@/data/ricardoTiktokClips";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

function TikTokFrame({ videoId, title }: { videoId: string; title: string }) {
  const src = `https://www.tiktok.com/embed/v2/${videoId}`;
  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-[10px]",
        "border border-stone-200/90 bg-stone-100",
        "shadow-[0_1px_0_rgba(0,0,0,0.04)]",
      )}
    >
      <div className="relative aspect-[9/16] w-full max-h-[min(52vh,380px)] min-h-[240px]">
        <iframe
          title={title}
          src={src}
          className="absolute left-1/2 top-0 h-[580px] w-[326px] max-w-none -translate-x-1/2 scale-[0.62] border-0 sm:scale-[0.64]"
          style={{ transformOrigin: "top center" }}
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
        className="mx-auto max-w-[1200px] px-5 pb-10 pt-9 sm:px-6 sm:pb-12 sm:pt-10"
      >
        <p className={cn(ui.home.eyebrow, "text-stone-500")}>{t("ricardoTiktok.eyebrow")}</p>
        <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[clamp(1.1rem,3.2vw,1.35rem)] font-medium leading-snug tracking-[-0.02em] text-stone-900">
          {t("ricardoTiktok.title")}
        </h2>
        <p className="mt-1 max-w-[46ch] text-[11px] font-light leading-relaxed text-stone-400 sm:text-[12px]">
          {t("ricardoTiktok.subline")}
        </p>

        <div className="relative mt-6">
          <div
            className={cn(
              "flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain",
              "scroll-smooth touch-pan-x pb-1 pl-0 pr-5 sm:gap-4 sm:pr-6",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {RICARDO_TIKTOK_CLIPS.map((clip, i) => (
              <article
                key={clip.videoId}
                className="w-[min(72vw,220px)] shrink-0 snap-start sm:w-[200px]"
              >
                <TikTokFrame videoId={clip.videoId} title={t(`ricardoTiktok.clipTitle${i + 1}`)} />
                <p className="mt-2 line-clamp-2 text-[10.5px] font-normal leading-snug text-stone-500 sm:text-[11px]">
                  {t(`ricardoTiktok.clipCaption${i + 1}`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
