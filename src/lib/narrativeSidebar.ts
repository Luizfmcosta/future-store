import { cn } from "@/lib/utils";

/** Inter Medium 12px, −4% — section labels + Stage/Vision labels. */
export const narrativeSidebarText =
  "text-[12px] font-medium leading-tight tracking-[-0.04em] font-[var(--font-narrative-sidebar)]";

/** Shopper name — Inter Medium 16px, −4%. */
export const shopperNameText =
  "text-[16px] font-medium leading-tight tracking-[-0.04em] font-[var(--font-narrative-sidebar)]";

/**
 * Shared border + background for sidebar controls (Shopper, Stage, Vision).
 * Default: visible subtle border; Active: stronger border + lift.
 */
export function sidebarRailSurfaceClass(active: boolean, light: boolean) {
  return cn(
    light
      ? active
        ? "border border-slate-400 bg-white text-slate-900 shadow-sm"
        : "border border-slate-200/55 bg-white/[0.65] text-slate-500 hover:border-slate-300/80 hover:bg-slate-50/90"
      : active
        ? "border border-white/[0.34] bg-white/[0.075] text-[#f2f4f8]"
        : "border border-white/[0.06] bg-white/[0.035] text-[#8b93a7] hover:border-white/[0.12] hover:bg-white/[0.055] hover:text-[#c8d0dc]",
  );
}
