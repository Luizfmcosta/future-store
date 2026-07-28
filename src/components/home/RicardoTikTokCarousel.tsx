"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { RICARDO_TIKTOK_CLIPS, type RicardoTikTokClip } from "@/data/ricardoTiktokClips";
import { useOnline } from "@/lib/hooks/useOnline";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * oEmbed TikTok: min-width 325px (docs). Altura ~708px é o chrome típico do embed v2
 * (abaixo disso o iframe ganha scroll interno).
 */
const EMBED_W = 325;
const EMBED_H = 708;

/**
 * Click-to-load facade: TikTok’s embed iframe often paints a full-bleed cookie consent
 * wall (especially with en-US Accept-Language), which reads as broken/blank blocks on
 * Ricardo’s home. No third-party request until the shopper opts in.
 */
function TikTokFrame({
  clip,
  title,
  loadLabel,
  offlineNotice,
}: {
  clip: RicardoTikTokClip;
  title: string;
  loadLabel: string;
  /** When set, skip cross-origin embed (not available offline with this SW). */
  offlineNotice?: string;
}) {
  const src = `https://www.tiktok.com/embed/v2/${clip.videoId}`;
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    if (offlineNotice || !active) return;
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
  }, [offlineNotice, active]);

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

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className={cn(
          "group relative flex w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl bg-[#0f0f0f] text-left",
          "[aspect-ratio:325/708]",
          ui.home.focusRing,
        )}
        aria-label={`${loadLabel} — ${clip.creatorName}`}
      >
        <span
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_58%)]"
          aria-hidden
        />
        <span className="relative z-[1] flex flex-col items-center gap-4 px-4">
          <span className="flex flex-col items-center gap-2">
            <span className="relative size-12 overflow-hidden rounded-full ring-1 ring-white/25 sm:size-14">
              <Image
                src={clip.creatorLogoSrc}
                alt=""
                fill
                className="object-cover object-center"
                sizes="56px"
                unoptimized
              />
            </span>
            <span className="max-w-[14ch] truncate text-center text-[13px] font-medium leading-tight text-white/90 sm:text-[14px]">
              {clip.creatorName}
            </span>
          </span>
          <span className="flex size-9 items-center justify-center rounded-full bg-white/30 text-white transition-transform duration-200 group-hover:scale-105 sm:size-10">
            <Play className="size-3.5 fill-current sm:size-4" aria-hidden />
          </span>
        </span>
      </button>
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
  const offlineEmbedNotice = online ? undefined : t("ricardoTiktok.offlinePlaceholder");

  return (
    <section className={cn("bg-white", ui.home.whiteSectionOnDarkCanvas)}>
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
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
                  clip={clip}
                  title={t("ricardoTiktok.embedTitle")}
                  loadLabel={t("ricardoTiktok.loadEmbed")}
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
