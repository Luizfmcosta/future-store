"use client";

import { Card } from "@/components/shared/Card";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn, formatBRL } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";
import { Filter } from "lucide-react";

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
        className
      )}
      aria-label={ariaLabel}
    >
      <Filter className="size-3.5" strokeWidth={2} aria-hidden />
    </button>
  );
}

/** Labeled control — matches `Card` height when used in a stretched flex row beside the results strip. */
function IntentFilterLabeledButton({ ariaLabel, label }: { ariaLabel: string; label: string }) {
  const setRefineOpen = useDemoStore((s) => s.setRefineOpen);

  return (
    <button
      type="button"
      onClick={() => setRefineOpen(true)}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 self-stretch rounded-2xl border border-stone-200/90 bg-white px-4 text-[13px] font-medium text-stone-800 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.12)] transition-colors hover:bg-stone-50",
        ui.home.focusRing,
        "focus-visible:rounded-2xl",
      )}
      aria-label={ariaLabel}
    >
      <Filter className="size-3.5 shrink-0 text-stone-600" strokeWidth={2} aria-hidden />
      {label}
    </button>
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

export function IntentSummary({
  intent,
  profile: _profile,
  aiMode,
}: {
  intent: SearchIntent;
  profile: ShopperProfileId;
  aiMode: boolean;
}) {
  const t = useT();

  if (!aiMode) {
    return (
      <div className="flex w-full min-w-0 items-stretch gap-2 sm:gap-3">
        <Card className="flex min-w-0 flex-1 items-center p-4">
          <p className="min-w-0 flex-1 text-[13px] text-stone-600">
            {t("searchSerp.resultsFor")}{" "}
            <span className="font-medium text-stone-800">{intent.rawQuery.trim() || t("searchSerp.browseFallback")}</span>
          </p>
        </Card>
        <IntentFilterLabeledButton ariaLabel={t("searchSerp.filterIntentAria")} label={t("searchSerp.filterIntentLabel")} />
      </div>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <EyebrowPill>{t("searchSerp.intentSummaryTitle")}</EyebrowPill>
        <IntentFilterButton ariaLabel={t("searchSerp.filterIntentAria")} />
      </div>
      <dl className="mt-4 grid gap-3 text-[13px] sm:grid-cols-2">
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
