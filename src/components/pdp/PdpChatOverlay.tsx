"use client";

import { StorefrontCartOverlay } from "@/components/cart/StorefrontCartOverlay";
import { SearchAiPanel } from "@/components/search/SearchAiPanel";
import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import { getProductById } from "@/data/products";
import { localizeProduct } from "@/lib/product-i18n";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo } from "react";

export function PdpChatOverlay() {
  const t = useT();
  const pathname = usePathname();
  const open = useDemoStore((s) => s.pdpChatOverlayOpen);
  const closePdpChatOverlay = useDemoStore((s) => s.closePdpChatOverlay);
  const titleId = useId();

  const comparisonTitle = useMemo(() => {
    const id = pathname?.startsWith("/product/") ? pathname.slice("/product/".length).split("/")[0] : undefined;
    const p = id ? getProductById(id) : undefined;
    if (!p) return t("pdp.chatComparisonTitle");
    return t("pdp.chatComparisonTitleWithProduct", { title: localizeProduct(p).title });
  }, [pathname, t]);

  const onClose = useCallback(() => {
    closePdpChatOverlay();
  }, [closePdpChatOverlay]);

  useEffect(() => {
    if (!open) return;
    const el = document.querySelector<HTMLElement>("[data-pdp-scroll]");
    const prev = el?.style.overflow ?? "";
    if (el) el.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePdpChatOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      if (el) el.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closePdpChatOverlay]);

  return (
    <StorefrontOverlayPortal>
      <StorefrontCartOverlay
        open={open}
        modalKey="pdp-chat"
        showFloatingPromptDock={false}
        onDismiss={onClose}
        backdropLabel={t("pdp.chatCloseAria")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-w-0 shrink-0 items-center justify-between gap-3 border-b border-stone-200/90 px-5 py-4">
            <h2
              id={titleId}
              className="min-w-0 flex-1 text-balance text-xl font-semibold tracking-tight text-stone-900"
            >
              {comparisonTitle}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900",
                ui.home.focusRing,
                "focus-visible:rounded-full",
              )}
              aria-label={t("pdp.chatCloseAria")}
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <SearchAiPanel variant="pdp" />
          </div>
        </div>
      </StorefrontCartOverlay>
    </StorefrontOverlayPortal>
  );
}
