"use client";

import { merchantRules } from "@/data/rules";

export function MerchantLayerPanel() {
  return (
    <ul className="space-y-3">
      {merchantRules.map((r) => (
        <li key={r.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
          <p className="text-[12px] font-semibold text-[#e8ecf4]">{r.label}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[#9aa3b8]">{r.detail}</p>
        </li>
      ))}
    </ul>
  );
}
