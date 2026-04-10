"use client";

import { AgentWebGLHero } from "@/components/agent/AgentWebGLHero";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";

const PILLAR_KEYS = ["p1", "p2", "p3", "p4", "p5"] as const;

const tileGlass =
  "rounded-3xl border border-white/[0.1] bg-white/[0.06] p-5 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-100 sm:p-6";

const pillarDescription =
  "text-[14px] leading-relaxed text-white/[0.82] sm:text-[15px]";

/**
 * Full-bleed architecture narrative for the AI Agent profile — no storefront frame.
 * md+: 2×3 grid; fifth card spans the row and stays one column wide, centered.
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
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-none">
        {/* `flex-1` + `justify-center`: vertically center when content is shorter than the viewport; grow + scroll when tall. */}
        <div className="flex w-full flex-1 flex-col justify-center">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12">
            <AgentWebGLHero className="mb-0 max-w-[min(100%,160px)]" />
            <header className="-mt-6 mb-10 sm:-mt-8 sm:mb-12 md:-mt-10">
              <h1 className="mx-auto max-w-[min(100%,32rem)] text-balance text-center text-[clamp(1.15rem,2.8vw,1.65rem)] font-semibold leading-snug tracking-tight text-white/95">
                {t("agentBento.hero")}
              </h1>
            </header>

            <div className="mx-auto grid w-full max-w-[min(100%,52rem)] grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              {PILLAR_KEYS.map((key) => (
                <article
                  key={key}
                  className={cn(
                    tileGlass,
                    "flex flex-col gap-2",
                    key === "p5" &&
                      "md:col-span-2 md:max-w-[calc(50%-0.625rem)] md:justify-self-center",
                  )}
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
      </div>
    </section>
  );
}
