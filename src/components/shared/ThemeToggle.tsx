"use client";

import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";
import { Moon, Sun } from "lucide-react";

const btn =
  "flex h-9 w-full items-center justify-center gap-2 rounded-lg border px-2 text-[12px] font-medium tracking-tight transition";

export function ThemeToggle() {
  const colorMode = useDemoStore((s) => s.colorMode);
  const setColorMode = useDemoStore((s) => s.setColorMode);
  const isLight = colorMode === "light";

  return (
    <button
      type="button"
      onClick={() => setColorMode(isLight ? "dark" : "light")}
      className={cn(
        btn,
        isLight
          ? "border-slate-200/90 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          : "border-white/[0.06] bg-white/[0.04] text-[#b8c0ce] hover:bg-white/[0.08]"
      )}
      aria-pressed={isLight}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {isLight ? <Moon className="h-3.5 w-3.5 shrink-0" /> : <Sun className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">{isLight ? "Dark" : "Light"}</span>
    </button>
  );
}
