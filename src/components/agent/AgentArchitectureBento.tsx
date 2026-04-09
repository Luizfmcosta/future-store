"use client";

import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";

const PILLAR_KEYS = ["p1", "p2", "p3", "p4", "p5"] as const;
type PillarKey = (typeof PILLAR_KEYS)[number];

const tileGlass =
  "rounded-3xl border border-white/[0.12] bg-white/[0.07] p-5 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150 sm:p-6";

const heroGlass =
  "rounded-[2rem] border border-white/[0.14] bg-white/[0.09] px-6 py-8 shadow-[0_32px_100px_-48px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-150 sm:px-10 sm:py-10";

const surfaceLabel = "text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45";
const surfaceBody = "mt-1.5 text-[13px] leading-relaxed text-white/[0.82] sm:text-[14px]";

function pillarGridClass(key: PillarKey): string {
  switch (key) {
    case "p1":
      return "md:col-span-7";
    case "p2":
      return "md:col-span-5";
    case "p3":
      return "md:col-span-6";
    case "p4":
      return "md:col-span-6";
    case "p5":
      return "md:col-span-12";
    default:
      return "";
  }
}

/**
 * Full-bleed architecture narrative (bento grid) for the AI Agent profile — no storefront frame.
 */
export function AgentArchitectureBento({ className }: { className?: string }) {
  const t = useT();

  return (
    <section
      aria-label={t("agentBento.pageAria")}
      className={cn(
        "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden",
        /* Mesh + vignette — independent of home hero */
        "bg-[#0a0c10]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(120,140,255,0.14),transparent_50%)]",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_90%_60%_at_100%_100%,rgba(80,200,180,0.06),transparent_45%)]",
        className,
      )}
    >
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12">
          <header className={cn(heroGlass, "mb-5 sm:mb-8")}>
            <h1 className="text-center text-[clamp(1.15rem,2.8vw,1.65rem)] font-semibold leading-snug tracking-tight text-white/95">
              {t("agentBento.hero")}
            </h1>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
            {PILLAR_KEYS.map((key) => (
              <article
                key={key}
                className={cn(tileGlass, "flex flex-col gap-5", pillarGridClass(key))}
              >
                <h2 className="text-[15px] font-semibold leading-tight text-white/95 sm:text-base">
                  <span className="text-white/40">{t(`agentBento.${key}.index` as "agentBento.p1.index")}</span>
                  <span className="text-white/35"> — </span>
                  {t(`agentBento.${key}.title` as "agentBento.p1.title")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 sm:p-5">
                    <p className={surfaceLabel}>{t("agentBento.humanSurface")}</p>
                    <p className={surfaceBody}>
                      {t(`agentBento.${key}.human` as "agentBento.p1.human")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-4 sm:p-5">
                    <p className={surfaceLabel}>{t("agentBento.agentSurface")}</p>
                    <p className={surfaceBody}>
                      {t(`agentBento.${key}.agent` as "agentBento.p1.agent")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
