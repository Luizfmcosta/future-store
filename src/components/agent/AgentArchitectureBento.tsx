"use client";

import { AgentWebGLHero } from "@/components/agent/AgentWebGLHero";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";

const PILLAR_KEYS = ["p1", "p2", "p3", "p4", "p5"] as const;
type PillarKey = (typeof PILLAR_KEYS)[number];

const tileGlass =
  "rounded-3xl border border-white/[0.1] bg-white/[0.06] p-5 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-100 sm:p-6";

const pillarDescription =
  "text-[14px] leading-relaxed text-white/[0.82] sm:text-[15px]";

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
        /* Neutral mesh — no cool tint */
        "bg-[#0a0a0a]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(255,255,255,0.055),transparent_50%)]",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_90%_60%_at_100%_100%,rgba(255,255,255,0.028),transparent_45%)]",
        className,
      )}
    >
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12">
          <AgentWebGLHero />
          <header className="mb-5 sm:mb-8">
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
                <h2 className="text-[15px] font-semibold leading-tight text-white/95 sm:text-[16px]">
                  {t(`agentBento.${key}.title` as "agentBento.p1.title")}
                </h2>
                <p className={pillarDescription}>
                  {t(`agentBento.${key}.agent` as "agentBento.p1.agent")}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
