"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { useT } from "@/lib/useT";

export function FitInsightWidget({ title, body }: { title: string; body: string }) {
  const t = useT();
  return (
    <div>
      <EyebrowPill>{t("pdp.idealEyebrow")}</EyebrowPill>
      <h3 className="mt-4 text-2xl font-normal text-neutral-900 sm:text-3xl">{title}</h3>
      <p className="mt-4 text-[15px] leading-relaxed text-neutral-600 sm:text-[16px]">{body}</p>
    </div>
  );
}
