"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { RICARDO_TIKTOK_CLIPS } from "@/data/ricardoTiktokClips";
import { useOnline } from "@/lib/hooks/useOnline";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * oEmbed TikTok: min-width 325px (docs). Altura ~708px é o chrome típico do embed v2
 * (abaixo disso o iframe ganha scroll interno).
 */
const EMBED_W = 325;
const EMBED_H = 708;

/**
 * Fills the reserved aspect box: native embed is 325×708; scale tracks shell width (cqw inside
 * `transform` is unreliable across browsers / pipelines, so we measure with ResizeObserver).
 */
function TikTokFrame({
  videoId,
  title,
  offlineNotice,
}: {
  videoId: string;
  title: string;
  /** When set, skip cross-origin embed (not available offline with this SW). */
  offlineNotice?: string;
}) {
  const src = `https://www.tiktok.com/embed/v2/${videoId}`;
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (offlineNotice) return;
    const el = shellRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      setScale(w > 0 ? Math.max(w / EMBED_W, 0.001) : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [offlineNotice]);

  if (offlineNotice) {
    return (
      <div
        className={cn(
          "relative flex w-full min-w-0 items-center justify-center overflow-hidden rounded-xl bg-stone-100 px-4 py-8 text-center",
          "[aspect-ratio:325/708]",
        )}
      >
        <p className="max-w-[28ch] text-pretty text-[14px] font-normal leading-relaxed text-stone-500 sm:text-[15px]">
          {offlineNotice}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative w-full min-w-0 overflow-hidden rounded-xl bg-[#0f0f0f] scrollbar-none",
        "ring-0 outline-none [aspect-ratio:325/708]",
      )}
    >
      <div
        className="absolute left-1/2 top-0 origin-top overflow-hidden will-change-transform"
        style={{
          width: EMBED_W,
          height: EMBED_H,
          transform: `translateX(-50%) scale(${scale})`,
        }}
      >
        <iframe
          title={title}
          src={src}
          width={EMBED_W}
          height={EMBED_H}
          scrolling="no"
          className="block overflow-hidden border-0 bg-transparent outline-none ring-0 scrollbar-none"
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
  const online = useOnline();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const sectionVisible = !online || inView;
  const offlineEmbedNotice = online ? undefined : t("ricardoTiktok.offlinePlaceholder");

  return (
    <section ref={ref} className={cn("bg-white", ui.home.whiteSectionOnDarkCanvas)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={sectionVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease }}
        className="mx-auto max-w-[1200px] min-w-0 px-5 pb-10 pt-9 sm:px-6 sm:pb-12 sm:pt-10"
      >
        <EyebrowPill variant="section">{t("ricardoTiktok.eyebrow")}</EyebrowPill>
        <h2 className="mt-2 max-w-[min(100%,40ch)] text-balance text-pretty text-[clamp(1.42rem,4.25vw,1.95rem)] font-medium leading-[1.12] tracking-[-0.02em] text-stone-900">
          {t("ricardoTiktok.title")}
        </h2>
        <p className="mt-1 max-w-[46ch] text-balance text-pretty text-[15px] font-normal leading-relaxed text-stone-400 sm:text-[16px]">
          {t("ricardoTiktok.subline")}
        </p>

        <div className="mt-6 w-full min-w-0 overflow-x-hidden">
          <div className="flex w-full flex-col gap-3.5 overflow-x-hidden sm:flex-row sm:gap-5">
            {RICARDO_TIKTOK_CLIPS.map((clip) => (
              <article key={clip.videoId} className="min-w-0 flex-1 basis-0 overflow-hidden">
                <TikTokFrame
                  videoId={clip.videoId}
                  title={t("ricardoTiktok.embedTitle")}
                  offlineNotice={offlineEmbedNotice}
                />
              </article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
