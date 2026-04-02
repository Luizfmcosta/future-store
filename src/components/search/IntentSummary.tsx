"use client";

import { Card } from "@/components/shared/Card";
import { ui } from "@/lib/ui-tokens";
import { cn, formatBRL } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { SearchIntent } from "@/types";
import type { ShopperProfileId } from "@/types";
import { Pencil } from "lucide-react";

function IntentEditButton({ className }: { className?: string }) {
  const setRefineOpen = useDemoStore((s) => s.setRefineOpen);

  return (
    <button
      type="button"
      onClick={() => setRefineOpen(true)}
      className={cn(
        "-m-1 flex size-7 shrink-0 items-center justify-center rounded-md text-[#8b96a8] transition-colors hover:bg-white/[0.06] hover:text-[#eef1f6]",
        ui.focusRing,
        "focus-visible:rounded-md",
        className
      )}
      aria-label="Edit intent"
    >
      <Pencil className="size-3.5" strokeWidth={2} aria-hidden />
    </button>
  );
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
  if (!aiMode) {
    return (
      <Card className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 text-[13px] text-[#9aa3b8]">Results for: {intent.rawQuery || "Browse"}</p>
          <IntentEditButton className="-mt-0.5" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Intent summary</p>
        <IntentEditButton />
      </div>
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
