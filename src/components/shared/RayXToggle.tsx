"use client";

import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import { useDemoStore } from "@/store/demoStore";

const narrativeBtn =
  "flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2 text-[11px] font-medium tracking-tight transition hover:bg-white/[0.08]";

export function RayXToggle({ className, variant }: { className?: string; variant?: "default" | "narrative" }) {
  const rayXMode = useDemoStore((s) => s.rayXMode);
  const setRayX = useDemoStore((s) => s.setRayX);
  const light = useDemoStore((s) => s.colorMode === "light");

  if (variant === "narrative") {
    return (
      <button
        type="button"
        onClick={() => setRayX(!rayXMode)}
        className={cn(
          light
            ? "flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200/90 bg-white px-2 text-[11px] font-medium tracking-tight shadow-sm transition hover:bg-slate-50"
            : narrativeBtn,
          rayXMode ? (light ? ui.toggleOnLight : ui.toggleOnDark) : light ? "text-slate-600" : "text-[#b8c0ce]",
          className
        )}
        aria-pressed={rayXMode}
      >
        <Layers className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">X-Ray</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRayX(!rayXMode)}
      title="X-Ray"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold tracking-tight transition-colors",
        rayXMode ? ui.toggleOnDark : "border-white/[0.06] bg-white/[0.04] text-[#a8b4c0]",
        className
      )}
      aria-pressed={rayXMode}
    >
      <Layers className="h-3.5 w-3.5" />
      X-Ray
    </button>
  );
}
