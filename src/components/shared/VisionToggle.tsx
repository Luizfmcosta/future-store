"use client";

import { narrativeSidebarText, sidebarRailSurfaceClass } from "@/lib/narrativeSidebar";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";

function visionButtonClass(active: boolean, light: boolean) {
  return cn(
    narrativeSidebarText,
    "flex min-h-10 w-full items-center justify-center rounded-[10px] px-2 transition",
    sidebarRailSurfaceClass(active, light),
  );
}

/** Human vs AI shopping / narrative mode (demo store `aiMode`). */
export function VisionToggle({ light = false }: { light?: boolean }) {
  const aiMode = useDemoStore((s) => s.aiMode);
  const setAiMode = useDemoStore((s) => s.setAiMode);

  return (
    <div className="flex flex-col gap-1.5" role="group" aria-label="Vision">
      <button
        type="button"
        onClick={() => setAiMode(false)}
        className={visionButtonClass(!aiMode, light)}
        aria-pressed={!aiMode}
      >
        Human
      </button>
      <button
        type="button"
        onClick={() => setAiMode(true)}
        className={visionButtonClass(aiMode, light)}
        aria-pressed={aiMode}
      >
        AI
      </button>
    </div>
  );
}
