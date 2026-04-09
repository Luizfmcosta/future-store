"use client";

import { StorefrontPromptComposer } from "@/components/search/StorefrontPromptComposer";
import { ui } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

/**
 * Bottom-fixed prompt row (shared by {@link FloatingSearchDock} and cart overlay).
 * Parent supplies positioning / z-index / `pointer-events`.
 */
export function FloatingPromptDock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none flex w-full justify-center px-4 sm:px-6",
        ui.floatingSearchBarRowPad,
        className,
      )}
    >
      <div className="pointer-events-auto w-full max-w-xl">
        <StorefrontPromptComposer />
      </div>
    </div>
  );
}
