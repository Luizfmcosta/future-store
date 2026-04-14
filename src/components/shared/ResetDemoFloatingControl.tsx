"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePrecacheStatus } from "@/lib/hooks/usePrecacheStatus";
import { hardResetSiteAndReload } from "@/lib/hardResetClientSite";
import { formatPrecacheTooltip, requestPrecacheAuditFromSw } from "@/lib/precacheStatus";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export function ResetDemoFloatingControl() {
  const router = useRouter();
  const t = useT();
  const triggerHomeWelcomeReset = useDemoStore((s) => s.triggerHomeWelcomeReset);
  const precacheState = usePrecacheStatus();
  const precacheTip = useMemo(() => formatPrecacheTooltip(precacheState, t), [precacheState, t]);
  const [hardResetBusy, setHardResetBusy] = useState(false);
  const [assistantStatusLine, setAssistantStatusLine] = useState<string | null>(null);

  const refreshAssistantStatus = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setAssistantStatusLine(t("homeWelcome.assistantStatusOffline"));
      return;
    }
    try {
      const r = await fetch("/api/assistant-status", { credentials: "include" });
      let data: { configured?: boolean; offline?: boolean };
      try {
        data = (await r.json()) as { configured?: boolean; offline?: boolean };
      } catch {
        setAssistantStatusLine(t("homeWelcome.assistantStatusUnknown"));
        return;
      }
      if (data.offline === true) {
        setAssistantStatusLine(t("homeWelcome.assistantStatusOffline"));
        return;
      }
      if (r.ok && typeof data.configured === "boolean") {
        setAssistantStatusLine(
          data.configured ? t("homeWelcome.assistantStatusOn") : t("homeWelcome.assistantStatusOff"),
        );
        return;
      }
      setAssistantStatusLine(t("homeWelcome.assistantStatusUnknown"));
    } catch {
      setAssistantStatusLine(t("homeWelcome.assistantStatusUnknown"));
    }
  }, [t]);

  const handleHardReset = useCallback(async () => {
    if (hardResetBusy) return;
    setHardResetBusy(true);
    try {
      await hardResetSiteAndReload();
    } catch {
      setHardResetBusy(false);
    }
  }, [hardResetBusy]);

  return (
    <TooltipProvider delay={8000} closeDelay={960}>
      <Tooltip>
        <TooltipTrigger
          render={(triggerProps) => (
            <button
              type="button"
              {...triggerProps}
              className={cn(
                triggerProps.className,
                "relative z-10 flex flex-1 items-center justify-center rounded-full outline-none transition-colors duration-200",
                ui.floatingChrome.segmentFocus,
                ui.floatingChrome.segmentInactive,
              )}
              aria-label={t("homeWelcome.ariaResetDemo")}
              onPointerEnter={(e) => {
                triggerProps.onPointerEnter?.(e);
                requestPrecacheAuditFromSw();
                void refreshAssistantStatus();
              }}
              onClick={(e) => {
                triggerProps.onClick?.(e);
                triggerHomeWelcomeReset();
                router.push("/");
              }}
            >
              <RotateCcw className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          )}
        />
        <TooltipContent
          hideArrow
          side="top"
          sideOffset={10}
          align="end"
          alignOffset={-4}
          className={cn(
            "w-[min(17rem,calc(100vw-2rem))] max-w-none border border-white/10 bg-zinc-950/95 px-2.5 py-2 text-left shadow-lg backdrop-blur-sm",
            "data-[side=top]:slide-in-from-bottom-1",
          )}
        >
          <div className="pointer-events-auto flex flex-col gap-2">
            <p className="text-[10px] font-normal leading-snug tracking-tight text-zinc-400">{precacheTip}</p>
            {assistantStatusLine ? (
              <p className="text-[10px] font-normal leading-snug tracking-tight text-zinc-400">
                {assistantStatusLine}
              </p>
            ) : null}
            <p className="text-[9px] leading-snug text-zinc-500">{t("homeWelcome.hardResetReloadHint")}</p>
            <button
              type="button"
              disabled={hardResetBusy}
              className={cn(
                "rounded-md border border-amber-500/25 bg-amber-950/35 px-2 py-1.5 text-center text-[10px] font-medium leading-tight text-amber-100/95 transition",
                "hover:border-amber-500/40 hover:bg-amber-950/50",
                "disabled:pointer-events-none disabled:opacity-45",
                ui.floatingChrome.segmentFocus,
              )}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void handleHardReset();
              }}
            >
              {hardResetBusy ? t("homeWelcome.hardResetReloadWorking") : t("homeWelcome.hardResetReloadCta")}
            </button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
