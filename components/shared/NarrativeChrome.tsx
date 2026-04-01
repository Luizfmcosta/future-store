"use client";

import { ProfileSwitcher } from "@/components/shared/ProfileSwitcher";
import { RayXToggle } from "@/components/shared/RayXToggle";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { Maximize2, Minimize2, SlidersHorizontal } from "lucide-react";

type NarrativeChromeProps = {
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  compact?: boolean;
  className?: string;
};

function useNarrativeActionClass() {
  const light = useDemoStore((s) => s.colorMode === "light");
  return cn(
    "flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg px-2 text-[11px] font-medium tracking-tight transition",
    light
      ? "border border-slate-200/90 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
      : "border border-white/[0.06] bg-white/[0.04] text-[#b8c0ce] hover:bg-white/[0.08]"
  );
}

function SectionLabel({ children, light }: { children: React.ReactNode; light: boolean }) {
  return <p className={ui.narrativeSectionLabel(light)}>{children}</p>;
}

export function NarrativeChrome({ onToggleFullscreen, isFullscreen, compact, className }: NarrativeChromeProps) {
  const togglePresenter = useDemoStore((s) => s.togglePresenter);
  const light = useDemoStore((s) => s.colorMode === "light");
  const actionClass = useNarrativeActionClass();

  const logo = (
    <div className="flex w-full justify-center px-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG brand asset */}
      <img
        src="/branding/future-store-v2.svg"
        alt="Future Store"
        className="h-[66px] w-auto max-w-full object-contain object-center"
      />
    </div>
  );

  const controls = (
    <div className="flex w-full flex-col gap-4">
      <section className="flex flex-col">
        <SectionLabel light={light}>Shopper</SectionLabel>
        <ProfileSwitcher variant="narrative" />
      </section>
      <section className="flex flex-col gap-1.5">
        <SectionLabel light={light}>Layers</SectionLabel>
        <RayXToggle variant="narrative" />
      </section>
      <section className="flex flex-col gap-1.5">
        <SectionLabel light={light}>Stage</SectionLabel>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={cn(
            actionClass,
            isFullscreen &&
              (light
                ? "border-slate-400 bg-slate-100 text-slate-900"
                : "border-white/[0.1] bg-white/[0.08] text-[#eef1f6]")
          )}
          aria-pressed={isFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 shrink-0" /> : <Maximize2 className="h-3.5 w-3.5 shrink-0" />}
          <span className="truncate">Fullscreen</span>
        </button>
        <button type="button" onClick={togglePresenter} className={actionClass} aria-label="Presenter">
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Presenter</span>
        </button>
      </section>
    </div>
  );

  const appearance = (
    <div className="flex flex-col">
      <SectionLabel light={light}>Appearance</SectionLabel>
      <ThemeToggle />
    </div>
  );

  const railBg = light ? "bg-[#eef0f6]" : "bg-[#080a0e]";
  const railDividerDesktop = light ? "border-r border-slate-200/80" : "border-r border-white/[0.06]";
  const railDividerCompactBottom = light ? "border-b border-slate-200/80" : "border-b border-white/[0.06]";

  if (compact) {
    return (
      <div className={cn(railDividerCompactBottom, railBg, "px-3 py-2.5", className)}>
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          {logo}
          {controls}
          {appearance}
        </div>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "flex w-[9.9rem] shrink-0 flex-col items-stretch overflow-hidden px-3 py-4 md:min-h-dvh",
        railBg,
        railDividerDesktop,
        className
      )}
    >
      {logo}
      <div className="mt-4 flex min-h-0 flex-1 flex-col">{controls}</div>
      <div className={cn("mt-auto pt-4", light ? "border-t border-slate-200/80" : "border-t border-white/[0.06]")}>
        {appearance}
      </div>
    </aside>
  );
}
