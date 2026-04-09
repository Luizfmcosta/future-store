"use client";

import { EyebrowPill } from "@/components/shared/EyebrowPill";
import { StorefrontRightSheet } from "@/components/shared/StorefrontRightSheet";
import { useT } from "@/lib/useT";
import { useDemoStore } from "@/store/demoStore";
import { X } from "lucide-react";

export function RefineDrawer() {
  const open = useDemoStore((s) => s.refineOpen);
  const setOpen = useDemoStore((s) => s.setRefineOpen);
  const t = useT();

  return (
    <StorefrontRightSheet
      open={open}
      sheetKey="refine"
      onDismiss={() => setOpen(false)}
      backdropLabel={t("searchSerp.refineCloseAria")}
      zClass="z-[70]"
      panelClassName="p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <EyebrowPill>{t("searchSerp.refineEyebrow")}</EyebrowPill>
          <h2 className="text-lg font-semibold text-stone-900">{t("searchSerp.refineTitle")}</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
          aria-label={t("searchSerp.refineCloseAria")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-stone-600">{t("searchSerp.refineBody")}</p>
    </StorefrontRightSheet>
  );
}
