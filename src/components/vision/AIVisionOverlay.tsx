"use client";

import { useLocale } from "@/context/LocaleContext";
import { getProductById } from "@/data/products";
import { useShopperSignals } from "@/hooks/useShopperSignals";
import { generateAIExplanation, type PageKind } from "@/lib/aiExplanation";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { AIExplanationType } from "@/types/aiExplanation";
import { motion } from "framer-motion";
import {
  Database,
  DollarSign,
  LayoutGrid,
  ListOrdered,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

const iconFor: Record<AIExplanationType, LucideIcon> = {
  content: LayoutGrid,
  curation: Sparkles,
  pricing: DollarSign,
  ranking: ListOrdered,
  data: Database,
};

function kindFromPath(pathname: string): PageKind {
  if (pathname === "/" || pathname === "") return "home";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/product/")) return "pdp";
  if (pathname.startsWith("/chat")) return "chat";
  return "home";
}

export function AIVisionOverlay() {
  const pathname = usePathname() ?? "/";
  const params = useParams<{ id?: string }>();
  const { locale } = useLocale();
  const t = useT();
  const profile = useDemoStore((s) => s.activeProfile);
  const setAiMode = useDemoStore((s) => s.setAiMode);
  const currentQuery = useDemoStore((s) => s.currentQuery);
  const parsedIntent = useDemoStore((s) => s.parsedIntent);

  const signals = useShopperSignals({ incrementVisitOnMount: false });

  const kind = useMemo(() => kindFromPath(pathname), [pathname]);
  const productId = typeof params?.id === "string" ? params.id : undefined;

  const product = useMemo(() => {
    if (kind !== "pdp" || !productId) return null;
    return getProductById(productId) ?? null;
  }, [kind, productId]);

  const items = useMemo(
    () =>
      generateAIExplanation(
        { profile, signals },
        {
          kind,
          pathname,
          productId,
          searchQuery: currentQuery,
          intent: parsedIntent,
          product,
        },
        locale,
      ),
    [profile, signals, kind, pathname, productId, currentQuery, parsedIntent, product, locale],
  );

  const close = useCallback(() => setAiMode(false), [setAiMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-auto absolute inset-0 z-[85] flex flex-col justify-end p-0 sm:flex-row sm:items-center sm:justify-end sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-vision-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-[#0a0a0a]/55 backdrop-blur-[3px] transition-opacity hover:bg-[#0a0a0a]/60"
          aria-label={t("aiVision.closeOverlay")}
          onClick={close}
        />

        <motion.aside
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className={cn(
            "relative z-10 flex max-h-[min(78dvh,640px)] w-full flex-col overflow-hidden rounded-t-[1.35rem] border border-white/[0.12]",
            "bg-[#141414]/92 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl",
            "sm:ml-auto sm:max-w-[min(100%,22rem)] sm:rounded-[1.25rem] sm:shadow-[0_24px_56px_-28px_rgba(0,0,0,0.45)]",
          )}
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.08] px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
            <div className="min-w-0 text-left">
              <p className="text-[11px] font-medium leading-snug text-white/50">{t("aiVision.eyebrow")}</p>
              <h2 id="ai-vision-title" className="mt-1.5 font-[family-name:var(--font-display)] text-[1.05rem] font-medium leading-snug tracking-[-0.02em] text-white">
                {t("aiVision.title")}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label={t("aiVision.close")}
            >
              <X className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain scrollbar-none px-4 py-3 sm:px-5 sm:py-4">
            <ul className="flex flex-col gap-2.5">
              {items.map((card, i) => {
                const Icon = iconFor[card.type];
                return (
                  <motion.li
                    key={card.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.35 }}
                  >
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 sm:px-4">
                      <div className="flex gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/85">
                          <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium leading-tight text-white/95">{card.title}</p>
                          <p className="mt-1.5 text-[11px] font-light leading-relaxed text-white/55">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </motion.aside>
      </motion.div>
  );
}
