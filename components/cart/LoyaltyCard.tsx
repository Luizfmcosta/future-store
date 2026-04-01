"use client";

import { Card } from "@/components/shared/Card";

export function LoyaltyCard() {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Membership</p>
      <h3 className="mt-2 text-[15px] font-semibold text-white">Extended protection + priority service</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[#aeb6ca]">
        Add structured coverage for panel and install — surfaced here as a calm upsell, not a hard sell.
      </p>
      <button
        type="button"
        className="mt-4 w-full rounded-full border border-white/[0.1] bg-white/[0.05] py-2.5 text-[13px] font-semibold text-[#e8ecf4] hover:bg-white/[0.08]"
      >
        View plan (demo)
      </button>
    </Card>
  );
}
