"use client";

import { Card } from "@/components/shared/Card";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn, formatBRL } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";

function IntentFilterButton({ className, ariaLabel }: { className?: string; ariaLabel: string }) {
  const setRefineOpen = useDemoStore((s) => s.setRefineOpen);

  return (
    <button
      type="button"
      onClick={() => setRefineOpen(true)}
      className={cn(
        "-m-1 flex size-7 shrink-0 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900",
        ui.home.focusRing,
        "focus-visible:rounded-md",
        className,
      )}
      aria-label={ariaLabel}
    >
      <Filter className="size-3.5" strokeWidth={2} aria-hidden />
    </button>
  );
}

const filterChipClass =
  "inline-flex h-10 shrink-0 items-center gap-0.5 rounded-full border border-stone-200/90 bg-white px-3.5 text-[15px] font-medium text-stone-900 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition hover:bg-stone-50";

/** Shop-style row: black circular control + scrollable white pills (below search headline). */
function SerpFilterChipStrip({ resultsCount }: { resultsCount: number }) {
  const t = useT();
  const setRefineOpen = useDemoStore((s) => s.setRefineOpen);
  const open = () => setRefineOpen(true);

  const chips: { msgKey: "filterChipCategory" | "filterChipOnSale" | "filterChipSort"; chevron: boolean }[] = [
    { msgKey: "filterChipCategory", chevron: true },
    { msgKey: "filterChipOnSale", chevron: false },
    { msgKey: "filterChipSort", chevron: true },
  ];

  return (
    <div className="-mx-4 min-w-0 sm:-mx-6">
      <div
        className="flex items-center gap-2 overflow-x-auto overscroll-x-contain px-4 pb-0.5 pt-0.5 scrollbar-none sm:px-6"
        role="toolbar"
        aria-label={t("searchSerp.filterBarAria")}
      >
        <button
          type="button"
          onClick={open}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-[0_1px_3px_rgba(0,0,0,0.14)] transition hover:bg-stone-800",
            ui.home.focusRing,
            "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          )}
          aria-label={t("searchSerp.filterIntentAria")}
        >
          <SlidersHorizontal className="size-[18px]" strokeWidth={2} aria-hidden />
        </button>

        {resultsCount > 0 ? (
          <button type="button" onClick={open} className={cn(filterChipClass, ui.home.focusRing, "focus-visible:rounded-full")}>
            {t("searchSerp.resultsCountPill", { count: resultsCount })}
          </button>
        ) : null}

        {chips.map(({ msgKey, chevron }) => (
          <button
            key={msgKey}
            type="button"
            onClick={open}
            className={cn(filterChipClass, ui.home.focusRing, "focus-visible:rounded-full")}
            aria-label={t("searchSerp.filterIntentAria")}
          >
            {t(`searchSerp.${msgKey}`)}
            {chevron ? <ChevronDown className="size-3.5 shrink-0 text-stone-500" strokeWidth={2} aria-hidden /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function intentRoomLabel(intent: SearchIntent, t: ReturnType<typeof useT>): string {
  const parts: string[] = [];
  if (intent.roomTypeKey === "living_room") parts.push(t("searchSerp.intentRoomLiving"));
  if (intent.roomDistanceKey === "3m_listening") parts.push(t("searchSerp.intentRoomDistance3m"));
  if (!parts.length) return t("searchSerp.intentGeneralRoom");
  return parts.join(" · ");
}

function intentSizeLabel(intent: SearchIntent, t: ReturnType<typeof useT>): string {
  if (intent.sizePreferenceKey === "compact_under_budget") return t("searchSerp.intentSizeCompact");
  if (intent.sizePreferenceKey === "room_3m_speakers") return t("searchSerp.intentSizeRoom3m");
  return t("searchSerp.intentSizeFlexible");
}

function intentPriorityLabel(intent: SearchIntent, t: ReturnType<typeof useT>): string {
  const p = intent.priority;
  if (p === "best-value") return t("searchSerp.intentPriorityBestValue");
  if (p === "premium") return t("searchSerp.intentPriorityPremium");
  if (p === "cinema") return t("searchSerp.intentPriorityCinema");
  if (p === "sports") return t("searchSerp.intentPrioritySports");
  return t("searchSerp.intentPriorityBestValue");
}

function intentDeliveryLabel(intent: SearchIntent, t: ReturnType<typeof useT>): string {
  if (intent.deliveryNeedKey === "sooner") return t("searchSerp.intentDeliverySooner");
  return t("searchSerp.intentDeliveryStandard");
}

function normalizeQueryForSerpTitle(q: string): string {
  return q.trim().replace(/\s+/g, " ").toLowerCase();
}

export function IntentSummary({
  intent,
  profile: _profile,
  aiMode,
  resultsCount = 0,
}: {
  intent: SearchIntent;
  profile: ShopperProfileId;
  aiMode: boolean;
  /** Non-AI SERP: shown in the first filter chip (“N results”). */
  resultsCount?: number;
}) {
  const t = useT();

  if (!aiMode) {
    const raw = intent.rawQuery.trim();
    const headline =
      normalizeQueryForSerpTitle(raw) === "cheap headphones"
        ? t("searchSerp.plpTitleCheapHeadphones")
        : raw || t("searchSerp.browseFallback");
    return (
      <div className="flex w-full min-w-0 flex-col gap-3">
        <h1 className="pt-8 text-pretty text-xl font-semibold leading-snug tracking-tight text-stone-900 sm:text-2xl">
          {headline}
        </h1>
        <SerpFilterChipStrip resultsCount={resultsCount} />
      </div>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <EyebrowPill>{t("searchSerp.intentSummaryTitle")}</EyebrowPill>
        <IntentFilterButton ariaLabel={t("searchSerp.filterIntentAria")} />
      </div>
      <dl className="mt-4 grid gap-3 text-[15px] sm:grid-cols-2 sm:text-[16px]">
        <div>
          <dt className="text-stone-500">{t("searchSerp.intentLabelDistance")}</dt>
          <dd className="font-medium text-stone-900">{intentSizeLabel(intent, t)}</dd>
        </div>
        <div>
          <dt className="text-stone-500">{t("searchSerp.intentLabelRoom")}</dt>
          <dd className="font-medium text-stone-900">{intentRoomLabel(intent, t)}</dd>
        </div>
        <div>
          <dt className="text-stone-500">{t("searchSerp.intentLabelBudget")}</dt>
          <dd className="font-medium text-stone-900">
            {intent.budget
              ? t("searchSerp.intentBudgetUpTo", { amount: formatBRL(intent.budget) })
              : t("searchSerp.intentBudgetFlexible")}
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">{t("searchSerp.intentLabelPriority")}</dt>
          <dd className="font-medium text-stone-900">{intentPriorityLabel(intent, t)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-stone-500">{t("searchSerp.intentLabelDelivery")}</dt>
          <dd className="font-medium text-stone-900">{intentDeliveryLabel(intent, t)}</dd>
        </div>
      </dl>
    </Card>
  );
}
