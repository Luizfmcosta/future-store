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
import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";

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
    <section id={id} className={cn("border-t border-stone-100 px-4 py-10 sm:px-6 sm:py-12", className)}>
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
  const [heroPreview, setHeroPreview] = useState<"marina" | "ricardo">("marina");

  const activateAiAndGoHome = useCallback(() => {
    setAiMode(true);
    router.push("/");
  }, [router, setAiMode]);

  return (
    <div className="flex flex-col bg-white pb-8">
      {/* Hero */}
      <div className="px-4 pt-2 sm:px-6 sm:pt-3">
        <div className="overflow-hidden rounded-2xl bg-[#0c0c0c] px-5 py-10 sm:px-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="mx-auto max-w-xl"
          >
            <p className="text-center font-[family-name:var(--font-display)] text-[13px] font-medium text-white/55 sm:text-[14px]">
              {t("aboutPage.centralLine")}
            </p>
            <h1 className="mt-4 text-center font-[family-name:var(--font-display)] text-[clamp(1.5rem,5vw,2.1rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white">
              {t("aboutPage.heroTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-[40ch] text-center text-[12px] font-light leading-relaxed text-white/60 sm:text-[13px]">
              {t("aboutPage.heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
              <Link
                href="/"
                className="inline-flex h-11 w-full max-w-xs items-center justify-center rounded-full bg-white px-6 text-[12px] font-medium text-[#0c0c0c] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                {t("aboutPage.ctaExplore")}
              </Link>
              <button
                type="button"
                onClick={activateAiAndGoHome}
                className="inline-flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-[12px] font-medium text-white backdrop-blur-sm transition hover:bg-white/15 sm:w-auto"
              >
                <Sparkles className="size-3.5 opacity-90" aria-hidden />
                {t("aboutPage.ctaAi")}
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setHeroPreview("marina")}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition sm:py-4",
                  heroPreview === "marina"
                    ? "border-white/35 bg-white/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <span className="text-[11px] font-medium text-white/50">{t("aboutPage.labelMarina")}</span>
                <p className="mt-2 text-[11px] font-light leading-relaxed text-white/75">{t("aboutPage.compareHeroMarina")}</p>
              </button>
              <button
                type="button"
                onClick={() => setHeroPreview("ricardo")}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition sm:py-4",
                  heroPreview === "ricardo"
                    ? "border-white/35 bg-white/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <span className="text-[11px] font-medium text-white/50">{t("aboutPage.labelRicardo")}</span>
                <p className="mt-2 text-[11px] font-light leading-relaxed text-white/75">{t("aboutPage.compareHeroRicardo")}</p>
              </button>
            </div>
            <motion.p
              key={heroPreview}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
              className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center text-[11px] font-light leading-relaxed text-white/65 sm:text-[12px]"
            >
              {heroPreview === "marina" ? t("aboutPage.compareToneMarina") : t("aboutPage.compareToneRicardo")}
            </motion.p>
          </motion.div>
        </div>
      </div>

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
        <div className="rounded-2xl border border-stone-200/90 bg-[#fafafa] px-5 py-8 text-center sm:px-8 sm:py-10">
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
