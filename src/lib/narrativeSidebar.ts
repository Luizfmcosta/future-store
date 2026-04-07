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
    "rounded-xl",
    light
      ? active
        ? "border border-slate-400 bg-white text-slate-900 shadow-sm"
        : "border border-slate-200/55 bg-white/[0.65] text-slate-500 hover:border-slate-300/80 hover:bg-slate-50/90"
      : active
        ? "border border-white/[0.14] bg-white/[0.08] text-[#f4f6fa] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        : "border border-white/[0.06] bg-white/[0.04] text-[#9aa3b0] hover:border-white/[0.1] hover:bg-white/[0.06] hover:text-[#c8d0dc]",
  );
}
