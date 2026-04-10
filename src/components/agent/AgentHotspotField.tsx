"use client";

/**
 * Magnetic hotspots + SVG spokes toward the sphere (inspired by
 * https://codepen.io/karlovidek/pen/ExjXKNV — Framer Motion + SVG, no GSAP/PIXI).
 */

import { AgentWebGLHero } from "@/components/agent/AgentWebGLHero";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const PILLAR_KEYS = ["p1", "p2", "p3", "p4", "p5"] as const;

const tileGlass =
  "rounded-3xl border border-white/[0.1] bg-white/[0.06] shadow-[0_24px_80px_-40px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-100";

const pillarDescription =
  "text-[13px] leading-relaxed text-white/[0.82] sm:text-[14px]";

/**
 * Percent **offsets** from field center (50%, 50%). Spoke lengths vary so radial distance to the orb
 * isn’t uniform.
 */
const HOTSPOT_OFFSET: Record<(typeof PILLAR_KEYS)[number], { dx: number; dy: number }> = {
  p1: { dx: -37, dy: -16 },
  p2: { dx: 35, dy: -30 },
  p3: { dx: -19, dy: -36 },
  p4: { dx: 27, dy: 16 },
  p5: { dx: -27, dy: 16 },
};

/** Field % Y (absolute) above this → card opens below the ring (avoids viewport top clipping). */
const CARD_OPEN_BELOW_THRESHOLD_Y = 46;

type HotspotKey = (typeof PILLAR_KEYS)[number];

function MagneticHotspot({
  hotspotKey,
  reduceMotion,
  circleRef,
  onHoverChange,
  active,
  cardOpenBelow,
}: {
  hotspotKey: HotspotKey;
  reduceMotion: boolean;
  circleRef: (el: HTMLSpanElement | null) => void;
  onHoverChange: (hovered: boolean) => void;
  active: boolean;
  /** When true, card anchors under the ring (top-full); otherwise above (bottom-full). */
  cardOpenBelow: boolean;
}) {
  const t = useT();
  const title = t(`agentBento.${hotspotKey}.title` as `agentBento.${HotspotKey}.title`);
  const body = t(`agentBento.${hotspotKey}.agent` as `agentBento.${HotspotKey}.agent`);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 280, damping: 28 });
  const sy = useSpring(my, { stiffness: 280, damping: 28 });
  const tx = useSpring(mx, { stiffness: 320, damping: 26 });
  const ty = useSpring(my, { stiffness: 320, damping: 26 });

  const circleX = useTransform(sx, (v) => (reduceMotion ? 0 : v / 3));
  const circleY = useTransform(sy, (v) => (reduceMotion ? 0 : v / 3));
  const textX = useTransform(tx, (v) => (reduceMotion ? 0 : v / 1.75));
  const textY = useTransform(ty, (v) => (reduceMotion ? 0 : v / 1.75));

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mx.set(e.clientX - cx);
    my.set(e.clientY - cy);
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
    onHoverChange(false);
  };

  const onPointerEnter = () => {
    onHoverChange(true);
  };

  const circleEl = (
    <motion.span
      ref={circleRef}
      style={{ x: circleX, y: circleY }}
      className="relative inline-flex size-11 shrink-0 items-center justify-center sm:size-12"
      aria-hidden
    >
      <span className="absolute inset-0 rounded-full border-2 border-white/[0.92] bg-white/[0.04]" />
      {!reduceMotion ? (
        <span
          className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-white/25 opacity-40 [animation-duration:1.8s]"
          aria-hidden
        />
      ) : null}
      <span className="relative size-2 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.45)]" />
    </motion.span>
  );

  /**
   * Card is absolutely positioned relative to the tight ring wrapper (not the outer hit-area box),
   * so `bottom-full` / `top-full` sit flush to the ring with only a hairline gap.
   */
  const cardPosition = cardOpenBelow
    ? "top-full left-1/2 z-[35] mt-px w-[min(88vw,19rem)] max-w-[19rem] -translate-x-1/2"
    : "bottom-full left-1/2 z-[35] mb-px w-[min(88vw,19rem)] max-w-[19rem] -translate-x-1/2";

  const cardEl = (
    <motion.article
      style={{ x: textX, y: textY }}
      aria-hidden={!active}
      className={cn(
        tileGlass,
        "absolute flex min-w-0 flex-col gap-2 px-4 py-3.5 shadow-2xl sm:gap-2.5 sm:px-5 sm:py-4",
        cardPosition,
        cardOpenBelow ? "origin-top" : "origin-bottom",
        "transition-[opacity,transform,visibility] duration-200 ease-out",
        active
          ? "visible scale-100 opacity-100"
          : "pointer-events-none invisible scale-95 opacity-0",
      )}
    >
      <h2 className="text-[14px] font-semibold leading-tight text-white/95 sm:text-[15px]">{title}</h2>
      <p className={pillarDescription}>{body}</p>
    </motion.article>
  );

  return (
    <div
      className={cn(
        "pointer-events-auto relative z-[30] flex min-h-[7rem] min-w-[7rem] items-center justify-center sm:min-h-[7.5rem] sm:min-w-[7.5rem]",
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerEnter={onPointerEnter}
    >
      <div className="relative inline-flex shrink-0 items-center justify-center">
        {cardEl}
        {circleEl}
      </div>
    </div>
  );
}

export function AgentHotspotField({ className }: { className?: string }) {
  const t = useT();
  const reduceMotion = useReducedMotion() ?? false;
  const fieldRef = useRef<HTMLDivElement>(null);
  const sphereAnchorRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<Partial<Record<HotspotKey, HTMLSpanElement | null>>>({});
  const [lines, setLines] = useState<
    { key: HotspotKey; x1: number; y1: number; x2: number; y2: number }[]
  >([]);
  const [hoveredKey, setHoveredKey] = useState<HotspotKey | null>(null);

  const measureLines = useCallback(() => {
    const field = fieldRef.current;
    const sphere = sphereAnchorRef.current;
    if (!field || !sphere) return;
    const fr = field.getBoundingClientRect();
    const sr = sphere.getBoundingClientRect();
    if (sr.width < 2 || sr.height < 2) return;
    const x1 = sr.left + sr.width / 2 - fr.left;
    const y1 = sr.top + sr.height / 2 - fr.top;

    const next: { key: HotspotKey; x1: number; y1: number; x2: number; y2: number }[] = [];
    for (const key of PILLAR_KEYS) {
      const el = circleRefs.current[key];
      if (!el) continue;
      const cr = el.getBoundingClientRect();
      const x2 = cr.left + cr.width / 2 - fr.left;
      const y2 = cr.top + cr.height / 2 - fr.top;
      next.push({ key, x1, y1, x2, y2 });
    }

    setLines((prev) => {
      if (
        prev.length === next.length &&
        prev.every((p, i) => {
          const n = next[i];
          if (!n || p.key !== n.key) return false;
          const ε = 0.35;
          return (
            Math.abs(p.x1 - n.x1) < ε &&
            Math.abs(p.y1 - n.y1) < ε &&
            Math.abs(p.x2 - n.x2) < ε &&
            Math.abs(p.y2 - n.y2) < ε
          );
        })
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  /** Hotspot rings move via Framer transforms — re-measure each frame so spokes track the ring. */
  useEffect(() => {
    let rafId = 0;
    const loop = () => {
      measureLines();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [measureLines]);

  useLayoutEffect(() => {
    measureLines();
    const ro = new ResizeObserver(() => measureLines());
    const field = fieldRef.current;
    const sphere = sphereAnchorRef.current;
    if (field) ro.observe(field);
    if (sphere) ro.observe(sphere);
    window.addEventListener("scroll", measureLines, { passive: true });
    window.addEventListener("resize", measureLines);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measureLines);
      window.removeEventListener("resize", measureLines);
    };
  }, [measureLines]);

  useEffect(() => {
    if (lines.length > 0) return;
    const id = window.setTimeout(() => measureLines(), 0);
    return () => clearTimeout(id);
  }, [lines.length, measureLines]);

  return (
    <div
      ref={fieldRef}
      className={cn(
        "relative mx-auto min-h-[min(88dvh,820px)] w-full max-w-[1100px] overflow-visible",
        className,
      )}
    >
      <svg
        className="pointer-events-none absolute inset-0 z-[5] h-full w-full overflow-visible"
        aria-hidden
      >
        {lines.map(({ key, x1, y1, x2, y2 }) => {
          const active = hoveredKey === key;
          return (
            <line
              key={key}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.85)"
              strokeWidth={active ? 1.25 : 0.85}
              opacity={active ? 0.55 : 0.2}
              className="transition-[opacity,stroke-width] duration-300"
            />
          );
        })}
      </svg>

      {/* Sphere slightly above field center; headline further below. */}
      <div className="pointer-events-none absolute inset-0 z-[25]">
        <div
          ref={sphereAnchorRef}
          className="pointer-events-none absolute left-1/2 top-[calc(50%-min(3rem,7dvh))] w-[min(100%,360px)] max-w-[360px] -translate-x-1/2 -translate-y-1/2"
        >
          {/* Parent must set width: w-fit + child w-full collapsed width → 0-height canvas on md+ */}
          <AgentWebGLHero className="pointer-events-none mb-0 w-full max-w-none sm:mb-0" />
        </div>
        <header className="pointer-events-auto absolute left-1/2 top-[calc(50%+clamp(12.5rem,30vw,14.5rem))] z-[22] w-full max-w-[min(100%,52rem)] -translate-x-1/2 px-4 text-center">
          <h1 className="whitespace-pre-line text-[clamp(1.1rem,3vw,2rem)] font-semibold leading-[1.2] tracking-tight text-white/95">
            {t("agentBento.hero")}
          </h1>
        </header>
      </div>

      {PILLAR_KEYS.map((key) => {
        const off = HOTSPOT_OFFSET[key];
        const topPercent = 50 + off.dy;
        const cardOpenBelow = topPercent < CARD_OPEN_BELOW_THRESHOLD_Y;
        return (
          <div
            key={key}
            className="absolute z-[30] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `calc(50% + ${off.dx}%)`,
              top: `calc(50% + ${off.dy}%)`,
            }}
          >
            <MagneticHotspot
              hotspotKey={key}
              reduceMotion={reduceMotion}
              active={hoveredKey === key}
              cardOpenBelow={cardOpenBelow}
              circleRef={(el) => {
                circleRefs.current[key] = el;
              }}
              onHoverChange={(h) => setHoveredKey(h ? key : null)}
            />
          </div>
        );
      })}
    </div>
  );
}
