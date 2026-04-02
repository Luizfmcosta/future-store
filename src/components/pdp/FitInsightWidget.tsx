"use client";

import { Card } from "@/components/shared/Card";

export function FitInsightWidget({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7d869c]">Ideal for you</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[#b4bcd1]">{body}</p>
    </Card>
  );
}
