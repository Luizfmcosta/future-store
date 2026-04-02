/**
 * Cool neutrals + white alpha. Borders: one hairline — no inset shadow + border stacks.
 */
export const ui = {
  eyebrow: "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b96a8]",
  sectionTitle:
    "text-lg font-semibold leading-tight tracking-tight text-[#eef1f6] sm:text-xl",
  label: "text-[12px] font-medium text-[#9ca8b8]",
  cardTitle: "text-[14px] font-semibold leading-snug text-[#e8ecf4]",
  body: "text-[13px] leading-relaxed text-[#b8c0ce]",
  price: "text-[15px] font-semibold tabular-nums text-[#eef1f6]",
  priceMuted: "text-[12px] font-medium text-[#7d8898] line-through",

  /** Default 1px edge on dark chrome */
  hairline: "border border-white/[0.06]",

  /** Secondary controls (ghost buttons, tertiary chips) */
  surfaceInset: "border border-white/[0.06]",

  /** Top bar search */
  searchBar:
    "rounded-full border border-white/[0.06] bg-[#14161c]/90 backdrop-blur-xl transition-[border-color,background-color] duration-200 ease-out hover:border-white/[0.08] hover:bg-[#161922]/95 focus-within:border-white/[0.09] focus-within:bg-[#161922]/95",

  narrativeSectionLabel: (light: boolean) =>
    light
      ? "mb-1.5 text-[9px] font-semibold uppercase tracking-[0.26em] text-slate-500"
      : "mb-1.5 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#6b7688]",

  focusRing: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white/20",
  focusRingInset: "ring-2 ring-white/15 ring-offset-2 ring-offset-[#060708]",

  toggleOnDark: "border-white/[0.12] bg-white/[0.08] text-[#f0f4fa]",
  toggleOnLight: "border-slate-300 bg-slate-100 text-slate-900",
};
