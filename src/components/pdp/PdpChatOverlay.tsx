"use client";

import { SearchAiPanel } from "@/components/search/SearchAiPanel";
import { StorefrontOverlayPortal } from "@/components/shared/StorefrontOverlayPortal";
import { useT } from "@/lib/useT";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import type { Product } from "@/types";
import { X } from "lucide-react";
import { useCallback, useEffect } from "react";

export function PdpChatOverlay({ product }: { product: Product }) {
  const t = useT();
  const open = useDemoStore((s) => s.pdpChatOverlayOpen);
  const closePdpChatOverlay = useDemoStore((s) => s.closePdpChatOverlay);
  const addPromptProductRef = useDemoStore((s) => s.addPromptProductRef);
  const removePromptProductRef = useDemoStore((s) => s.removePromptProductRef);

  useEffect(() => {
    if (!open) return;
    addPromptProductRef({ productId: product.id, label: product.title });
    return () => {
      removePromptProductRef(product.id);
    };
  }, [open, product.id, product.title, addPromptProductRef, removePromptProductRef]);

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

  if (!open) return null;

  return (
    <StorefrontOverlayPortal>
      <div
        className="pointer-events-auto absolute inset-0 z-[50] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdp-chat-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
          aria-label={t("pdp.chatCloseAria")}
          onClick={onClose}
        />
        <div className="relative mt-auto w-full px-2.5 pb-0 pt-0 sm:px-4">
          <div
            className={cn(
              "flex h-[min(85dvh,720px)] w-full flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04]",
              "pb-[env(safe-area-inset-bottom,0px)]",
            )}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200/90 px-4 py-3.5 sm:px-5">
              <h2 id="pdp-chat-title" className="text-[15px] font-semibold tracking-tight text-neutral-900">
                {t("pdp.chatOverlayTitle")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900",
                  ui.home.focusRing,
                )}
                aria-label={t("pdp.chatCloseAria")}
              >
                <X className="size-5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <SearchAiPanel />
            </div>
          </div>
        </div>
      </div>
    </StorefrontOverlayPortal>
  );
}
