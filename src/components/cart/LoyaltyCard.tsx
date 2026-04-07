"use client";

import { Card } from "@/components/shared/Card";

export function LoyaltyCard() {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Membership</p>
      <h3 className="mt-2 text-[15px] font-semibold text-stone-900">Extended protection + priority service</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-stone-600">
        Add structured coverage for panel and install — surfaced here as a calm upsell, not a hard sell.
      </p>
      <button
        type="button"
        className="mt-4 w-full rounded-full border border-stone-200/90 bg-stone-50 py-2.5 text-[13px] font-semibold text-stone-800 hover:bg-stone-100"
      >
        View plan (demo)
      </button>
    </Card>
  );
}
