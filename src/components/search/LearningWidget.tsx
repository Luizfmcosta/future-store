"use client";

import { Card } from "@/components/shared/Card";
import type { LearningWidgetVariant } from "@/lib/recommendations";
import { useT } from "@/lib/useT";

export function LearningWidget({ variant }: { variant: LearningWidgetVariant }) {
  const t = useT();
  const isSurround = variant === "surround";

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">{t("searchSerp.learningCompact")}</p>
          <h3 className="mt-2 text-lg font-semibold text-stone-900">
            {isSurround ? t("searchSerp.learningSurroundTitle") : t("searchSerp.learningPortableTitle")}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-stone-600">
            {isSurround ? t("searchSerp.learningSurroundBody") : t("searchSerp.learningPortableBody")}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-stone-200/90 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
          {isSurround ? t("searchSerp.learningSurroundTag") : t("searchSerp.learningPortableTag")}
        </span>
      </div>
    </Card>
  );
}
