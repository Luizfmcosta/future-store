"use client";

import { Card } from "@/components/shared/Card";
import { EyebrowPill } from "@/components/shared/EyebrowPill";

export function FitInsightWidget({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-5 sm:p-6">
      <EyebrowPill>Ideal for you</EyebrowPill>
      <h3 className="mt-2 text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-stone-600">{body}</p>
    </Card>
  );
}
