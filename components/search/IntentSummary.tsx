"use client";

import { intentSummaryIntro } from "@/lib/copy";
import { formatBRL } from "@/lib/utils";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";
import { Card } from "@/components/shared/Card";

export function IntentSummary({
  intent,
  profile,
  aiMode,
}: {
  intent: SearchIntent;
  profile: ShopperProfileId;
  aiMode: boolean;
}) {
  if (!aiMode) {
    return (
      <Card className="p-4">
        <p className="text-[13px] text-[#9aa3b8]">Results for: {intent.rawQuery || "Browse"}</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Intent summary</p>
      <p className="mt-2 text-[14px] text-[#aeb6ca]">{intentSummaryIntro(profile)}</p>
      <dl className="mt-4 grid gap-3 text-[13px] sm:grid-cols-2">
        <div>
          <dt className="text-[#6f778a]">Size / distance</dt>
          <dd className="font-medium text-[#e8ecf4]">{intent.sizePreference ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[#6f778a]">Room</dt>
          <dd className="font-medium text-[#e8ecf4]">{intent.roomType ?? intent.roomDistance ?? "General"}</dd>
        </div>
        <div>
          <dt className="text-[#6f778a]">Budget band</dt>
          <dd className="font-medium text-[#e8ecf4]">{intent.budget ? `Up to ${formatBRL(intent.budget)}` : "Flexible"}</dd>
        </div>
        <div>
          <dt className="text-[#6f778a]">Priority</dt>
          <dd className="font-medium text-[#e8ecf4]">{intent.priority ?? "balanced"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[#6f778a]">Delivery</dt>
          <dd className="font-medium text-[#e8ecf4]">{intent.deliveryNeed ?? "Standard options"}</dd>
        </div>
      </dl>
    </Card>
  );
}
