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

/**
 * Fills the column width: fixed 325×708 embed scaled by `100cqw / 325px` from the `@container` shell.
 */
function TikTokFrame({ videoId, title }: { videoId: string; title: string }) {
  const src = `https://www.tiktok.com/embed/v2/${videoId}`;
  return (
    <div
      className={cn(
        "@container relative w-full overflow-hidden rounded-xl bg-[#0f0f0f]",
        "ring-0 outline-none [aspect-ratio:325/708]",
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 top-0 origin-top",
          "h-[708px] w-[325px] -translate-x-1/2",
          "[transform:translateX(-50%)_scale(calc(100cqw/325px))]",
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
        <h2 className="mt-1.5 text-[clamp(1.1rem,3.2vw,1.35rem)] font-medium leading-snug tracking-[-0.02em] text-stone-900">
          {t("ricardoTiktok.title")}
        </h2>
        <p className="mt-1 max-w-[46ch] text-[15px] font-light leading-relaxed text-stone-400 sm:text-[16px]">
          {t("ricardoTiktok.subline")}
        </p>

        <div className="mt-6 w-full min-w-0">
          <div className="flex w-full flex-col gap-3.5 sm:flex-row sm:gap-5">
            {RICARDO_TIKTOK_CLIPS.map((clip) => (
              <article key={clip.videoId} className="min-w-0 flex-1 basis-0">
                <TikTokFrame videoId={clip.videoId} title={t("ricardoTiktok.embedTitle")} />
              </article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
