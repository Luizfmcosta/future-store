"use client";

import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";

const narrativeCell =
  "flex h-9 items-center justify-center rounded-lg border border-white/[0.06] bg-[#0c0e12]/80 text-[11px] font-medium tracking-tight transition hover:bg-white/[0.06]";

export function ProfileSwitcher({
  className,
  variant,
}: {
  className?: string;
  variant?: "default" | "narrative";
}) {
  const activeProfile = useDemoStore((s) => s.activeProfile);
  const setProfile = useDemoStore((s) => s.setProfile);
  const light = useDemoStore((s) => s.colorMode === "light");

  if (variant === "narrative") {
    return (
      <div className={cn("grid w-full grid-cols-2 gap-1", className)} role="group" aria-label="Profile">
        {(["marina", "ricardo"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setProfile(id)}
            className={cn(
              light
                ? "flex h-9 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-[11px] font-medium tracking-tight shadow-sm transition hover:bg-slate-50"
                : narrativeCell,
              activeProfile === id
                ? light
                  ? "border-slate-400 bg-slate-100 text-slate-900"
                  : "border-white/[0.14] bg-white/[0.12] text-white"
                : light
                  ? "text-slate-500"
                  : "text-[#b8c0ce]"
            )}
          >
            {id === "marina" ? "Marina" : "Ricardo"}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex rounded-full border border-white/[0.06] bg-[#0c0e12]/70 p-0.5 backdrop-blur-md", className)} role="group" aria-label="Profile">
      {(["marina", "ricardo"] as const).map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => setProfile(id)}
          className={cn(
            "rounded-full px-3 py-1.5 text-[12px] font-semibold tracking-tight transition-colors",
            activeProfile === id ? "bg-white/[0.12] text-white shadow-inner" : "text-[#9aa3b8] hover:text-[#dce1ed]"
          )}
        >
          {id === "marina" ? "Marina" : "Ricardo"}
        </button>
      ))}
    </div>
  );
}
