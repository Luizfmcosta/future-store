"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Database,
  DollarSign,
  LayoutGrid,
  ListOrdered,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ABOUT_HERO_VIDEO_SRC } from "@/lib/storefrontHeroVideo";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("border-t border-stone-100 px-4 py-9 sm:px-5 sm:py-12 md:px-6", className)}
    >
      {children}
    </section>
  );
}

function CompareRow({
  labelA,
  labelB,
  textA,
  textB,
}: {
  labelA: string;
  labelB: string;
  textA: string;
  textB: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 sm:p-5">
        <p className="text-[10px] font-medium text-stone-500">{labelA}</p>
        <p className="mt-2 text-[12px] font-light leading-relaxed text-stone-700 sm:text-[13px]">{textA}</p>
      </div>
      <div className="rounded-2xl border border-stone-200/90 bg-white p-4 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.08)] sm:p-5">
        <p className="text-[10px] font-medium text-stone-500">{labelB}</p>
        <p className="mt-2 text-[12px] font-light leading-relaxed text-stone-700 sm:text-[13px]">{textB}</p>
      </div>
    </div>
  );
}

function InsightBlock({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.06)] sm:gap-4 sm:p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#1a1a1a]">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <h3 className="text-[13px] font-medium leading-snug text-[#1a1a1a]">{title}</h3>
        <p className="mt-1.5 text-[11px] font-light leading-relaxed text-stone-500 sm:text-[12px]">{body}</p>
      </div>
    </div>
  );
}

export function AboutPage() {
  const t = useT();
  const router = useRouter();
  const setAiMode = useDemoStore((s) => s.setAiMode);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = heroVideoRef.current;
    if (!el) return;
    el.play().catch(() => {
      /* autoplay policy */
    });
  }, []);

  const activateAiAndGoHome = useCallback(() => {
    setAiMode(true);
    router.push("/");
  }, [router, setAiMode]);

  return (
    <div className="flex flex-col bg-white pb-8">
      {/* Hero: full bleed in the storefront column, tall first screen (like home) */}
      <section
        id="about-hero"
        className="relative flex w-full min-h-[100svh] flex-col overflow-hidden rounded-none bg-[#0c0c0c]"
      >
        {/* Same motion language as home hero: loop + gradient scrim */}
        <div className="pointer-events-none absolute inset-0 min-h-full">
          <video
            ref={heroVideoRef}
            key={ABOUT_HERO_VIDEO_SRC}
            className="absolute inset-0 h-full w-full object-cover opacity-[0.45]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={ABOUT_HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/[0.12] to-black/20"
            aria-hidden
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-end px-4 pb-6 pt-[calc(3.25rem+0.75rem)] sm:px-6 sm:pb-40 sm:pt-[calc(3.75rem+1rem)] -translate-y-3 sm:-translate-y-5"
        >
          <p className="text-center font-[family-name:var(--font-display)] text-[12px] font-normal text-white/70 sm:text-[15px]">
            {t("aboutPage.centralLine")}
          </p>
          <h1 className="mt-3 text-center font-[family-name:var(--font-display)] text-[clamp(1.55rem,5.2vw,2.35rem)] font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-[clamp(1.85rem,6.2vw,2.65rem)]">
            {t("aboutPage.heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-[42ch] text-center text-[11px] font-light leading-relaxed text-white/65 sm:text-[14px]">
            {t("aboutPage.heroSubtitle")}
          </p>

          <div className="mt-8 flex w-full min-w-0 flex-col items-stretch justify-center gap-2.5 @[44rem]:flex-row @[44rem]:items-center @[44rem]:justify-center @[44rem]:gap-3">
            <Link
              href="/"
              className="inline-flex h-11 min-h-11 w-full shrink-0 items-center justify-center rounded-full bg-white px-5 text-[12px] font-medium leading-none text-[#0c0c0c] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98] @[44rem]:w-auto @[44rem]:max-w-xs @[44rem]:px-6"
            >
              {t("aboutPage.ctaExplore")}
            </Link>
            <button
              type="button"
              onClick={activateAiAndGoHome}
              className="inline-flex h-11 min-h-11 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/[0.12] px-4 text-[12px] font-medium leading-none text-white backdrop-blur-md transition hover:bg-white/[0.18] @[44rem]:w-auto @[44rem]:max-w-xs @[44rem]:px-6"
            >
              <Sparkles className="size-3.5 opacity-90" aria-hidden />
              {t("aboutPage.ctaAi")}
            </button>
          </div>
        </motion.div>
      </section>

      <Section>
        <h2 className="max-w-[22rem] font-[family-name:var(--font-display)] text-[clamp(1.15rem,3.2vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]">
          {t("aboutPage.multiTitle")}
        </h2>
        <p className="mt-3 max-w-[40ch] text-[11.5px] font-light leading-[1.65] text-stone-500 sm:text-[12px]">{t("aboutPage.multiIntro")}</p>

        <div className="mt-8 space-y-4">
          <CompareRow
            labelA={t("aboutPage.labelMarina")}
            labelB={t("aboutPage.labelRicardo")}
            textA={t("aboutPage.compareHeroMarina")}
            textB={t("aboutPage.compareHeroRicardo")}
          />
          <CompareRow
            labelA={t("aboutPage.labelMarina")}
            labelB={t("aboutPage.labelRicardo")}
            textA={t("aboutPage.compareProductsMarina")}
            textB={t("aboutPage.compareProductsRicardo")}
          />
          <CompareRow
            labelA={t("aboutPage.labelMarina")}
            labelB={t("aboutPage.labelRicardo")}
            textA={t("aboutPage.compareToneMarina")}
            textB={t("aboutPage.compareToneRicardo")}
          />
        </div>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.15rem,3.2vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]">
          {t("aboutPage.iaDoingTitle")}
        </h2>
        <div className="mt-6 flex flex-col gap-3">
          <InsightBlock icon={LayoutGrid} title={t("aboutPage.blockContentTitle")} body={t("aboutPage.blockContentBody")} />
          <InsightBlock icon={Sparkles} title={t("aboutPage.blockCurationTitle")} body={t("aboutPage.blockCurationBody")} />
          <InsightBlock icon={DollarSign} title={t("aboutPage.blockPricingTitle")} body={t("aboutPage.blockPricingBody")} />
          <InsightBlock icon={ListOrdered} title={t("aboutPage.blockRankingTitle")} body={t("aboutPage.blockRankingBody")} />
        </div>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.15rem,3.2vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]">
          {t("aboutPage.visionTitle")}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200/90 bg-stone-50/90 p-5">
            <div className="flex items-center gap-2 text-stone-700">
              <Users className="size-4" strokeWidth={1.75} aria-hidden />
              <h3 className="text-[13px] font-medium">{t("aboutPage.visionHumanTitle")}</h3>
            </div>
            <p className="mt-2 text-[11px] font-light leading-relaxed text-stone-600 sm:text-[12px]">{t("aboutPage.visionHumanBody")}</p>
          </div>
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 text-[#1a1a1a]">
              <Sparkles className="size-4" strokeWidth={1.75} aria-hidden />
              <h3 className="text-[13px] font-medium">{t("aboutPage.visionAiTitle")}</h3>
            </div>
            <p className="mt-2 text-[11px] font-light leading-relaxed text-stone-600 sm:text-[12px]">{t("aboutPage.visionAiBody")}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200/90 bg-[#141414] p-4 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] sm:p-5">
          <p className="text-[11px] font-medium leading-snug text-white/50">{t("aboutPage.mockEyebrow")}</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-[1rem] font-medium text-white">{t("aboutPage.mockTitle")}</p>
          <ul className="mt-4 flex flex-col gap-2">
            <li className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3">
              <p className="text-[12px] font-medium text-white/95">{t("aboutPage.mockCard1Title")}</p>
              <p className="mt-1 text-[11px] font-light leading-relaxed text-white/55">{t("aboutPage.mockCard1Body")}</p>
            </li>
            <li className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3">
              <p className="text-[12px] font-medium text-white/95">{t("aboutPage.mockCard2Title")}</p>
              <p className="mt-1 text-[11px] font-light leading-relaxed text-white/55">{t("aboutPage.mockCard2Body")}</p>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={activateAiAndGoHome}
          className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-5 text-[11px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:min-w-[14rem]"
        >
          <Sparkles className="size-3.5" aria-hidden />
          {t("aboutPage.visionCta")}
        </button>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.15rem,3.2vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]">
          {t("aboutPage.flowTitle")}
        </h2>
        <p className="mt-3 max-w-[42ch] text-[11.5px] font-light leading-[1.65] text-stone-500 sm:text-[12px]">{t("aboutPage.flowContextDetail")}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-stone-600 sm:gap-3 sm:text-[12px]">
          <span className="rounded-full bg-stone-100 px-3 py-1.5">{t("aboutPage.flowStepUser")}</span>
          <ArrowRight className="size-4 shrink-0 text-stone-400" aria-hidden />
          <span className="rounded-full bg-stone-100 px-3 py-1.5">{t("aboutPage.flowStepContext")}</span>
          <ArrowRight className="size-4 shrink-0 text-stone-400" aria-hidden />
          <span className="rounded-full bg-stone-100 px-3 py-1.5">{t("aboutPage.flowStepIa")}</span>
          <ArrowRight className="size-4 shrink-0 text-stone-400" aria-hidden />
          <span className="rounded-full bg-[#1a1a1a] px-3 py-1.5 text-white">{t("aboutPage.flowStepPage")}</span>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 sm:p-5">
          <div className="flex gap-2">
            <Database className="mt-0.5 size-4 shrink-0 text-stone-500" strokeWidth={1.75} aria-hidden />
            <p className="text-[12px] font-light leading-relaxed text-stone-700">{t("aboutPage.flowExample1")}</p>
          </div>
          <div className="flex gap-2">
            <Database className="mt-0.5 size-4 shrink-0 text-stone-500" strokeWidth={1.75} aria-hidden />
            <p className="text-[12px] font-light leading-relaxed text-stone-700">{t("aboutPage.flowExample2")}</p>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.15rem,3.2vw,1.5rem)] font-medium leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]">
          {t("aboutPage.whyTitle")}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium text-stone-500">{t("aboutPage.whyUserTitle")}</p>
            <ul className="mt-3 space-y-2 text-[12px] font-light leading-relaxed text-stone-700">
              <li className="flex gap-2">
                <span className="text-stone-400">·</span>
                {t("aboutPage.whyUser1")}
              </li>
              <li className="flex gap-2">
                <span className="text-stone-400">·</span>
                {t("aboutPage.whyUser2")}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium text-stone-500">{t("aboutPage.whyBizTitle")}</p>
            <ul className="mt-3 space-y-2 text-[12px] font-light leading-relaxed text-stone-700">
              <li className="flex gap-2">
                <span className="text-stone-400">·</span>
                {t("aboutPage.whyBiz1")}
              </li>
              <li className="flex gap-2">
                <span className="text-stone-400">·</span>
                {t("aboutPage.whyBiz2")}
              </li>
              <li className="flex gap-2">
                <span className="text-stone-400">·</span>
                {t("aboutPage.whyBiz3")}
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section className="border-b border-stone-100">
        <div className="rounded-2xl border border-stone-200/90 bg-[#fafafa] px-4 py-8 text-center sm:px-8 sm:py-10">
          <h2 className="mx-auto max-w-[20rem] font-[family-name:var(--font-display)] text-[clamp(1.2rem,3.5vw,1.65rem)] font-medium leading-[1.2] tracking-[-0.015em] text-[#1a1a1a]">
            {t("aboutPage.finalTitle")}
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
            <Link
              href="/"
              className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-full bg-[#1a1a1a] px-6 text-[12px] font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              {t("aboutPage.finalCtaStore")}
            </Link>
            <button
              type="button"
              onClick={activateAiAndGoHome}
              className="inline-flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-stone-200/90 bg-white px-6 text-[12px] font-medium text-stone-800 transition hover:bg-stone-50 sm:w-auto"
            >
              <Sparkles className="size-3.5" aria-hidden />
              {t("aboutPage.finalCtaAi")}
            </button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <EyebrowPill className="bg-white">{t("aboutPage.pillTransparent")}</EyebrowPill>
            <EyebrowPill className="bg-white">{t("aboutPage.pillAdaptive")}</EyebrowPill>
            <EyebrowPill className="bg-white">{t("aboutPage.pillExplainable")}</EyebrowPill>
          </div>
        </div>
      </Section>
    </div>
  );
}
