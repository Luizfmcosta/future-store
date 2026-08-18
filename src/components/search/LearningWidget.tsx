"use client";

import { Card } from "@/components/shared/Card";
import { EyebrowPill } from "@/components/shared/EyebrowPill";
import type { LearningWidgetVariant } from "@/lib/recommendations";
import { useT } from "@/lib/useT";

export function LearningWidget({ variant }: { variant: LearningWidgetVariant }) {
  const t = useT();
  const copy =
    variant === "setups"
      ? {
          title: t("searchSerp.learningSetupsTitle"),
          body: t("searchSerp.learningSetupsBody"),
          tag: t("searchSerp.learningSetupsTag"),
        }
      : variant === "surround"
        ? {
            title: t("searchSerp.learningSurroundTitle"),
            body: t("searchSerp.learningSurroundBody"),
            tag: t("searchSerp.learningSurroundTag"),
          }
        : {
            title: t("searchSerp.learningPortableTitle"),
            body: t("searchSerp.learningPortableBody"),
            tag: t("searchSerp.learningPortableTag"),
          };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowPill>{t("searchSerp.learningCompact")}</EyebrowPill>
          <h3 className="mt-2 text-lg font-semibold text-stone-900">{copy.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-600 sm:text-[17px] sm:leading-[1.65]">
            {copy.body}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-stone-200/90 bg-stone-50 px-2.5 py-1 text-[15px] font-semibold text-stone-600">
          {copy.tag}
        </span>
      </div>
    </Card>
  );
}
