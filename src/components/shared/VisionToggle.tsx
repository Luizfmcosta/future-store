"use client";

import { narrativeSidebarText, sidebarRailSurfaceClass } from "@/lib/narrativeSidebar";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demoStore";

function visionButtonClass(active: boolean, light: boolean) {
  return cn(
    narrativeSidebarText,
    "flex min-h-9 w-full items-center justify-center px-2 text-[12px] transition",
    sidebarRailSurfaceClass(active, light),
  );
}

/** Human vs AI shopping / narrative mode (demo store `aiMode`). */
export function VisionToggle({ light = false }: { light?: boolean }) {
  const aiMode = useDemoStore((s) => s.aiMode);
  const setAiMode = useDemoStore((s) => s.setAiMode);
  const t = useT();

  return (
    <div className="flex flex-col gap-1" role="group" aria-label={t("narrative.vision")}>
      <button
        type="button"
        onClick={() => setAiMode(false)}
        className={visionButtonClass(!aiMode, light)}
        aria-pressed={!aiMode}
      >
        {t("narrative.visionHuman")}
      </button>
      <button
        type="button"
        onClick={() => setAiMode(true)}
        className={visionButtonClass(aiMode, light)}
        aria-pressed={aiMode}
      >
        {t("narrative.visionAi")}
      </button>
    </div>
  );
}
