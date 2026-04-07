/**
 * Cool neutrals + white alpha. Borders: one hairline — no inset shadow + border stacks.
 */
export const ui = {
  /** Muted line on dark chrome — sentence case, no wide tracking */
  eyebrow: "text-[13px] font-medium leading-snug text-[#9ca8b8] tracking-normal",
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

  /** Floating composer / fields on white (search AI, etc.) */
  searchBarOnLight:
    "rounded-full border border-stone-200/90 bg-white/95 backdrop-blur-xl transition-[border-color,background-color] duration-200 ease-out hover:border-stone-300/90 hover:bg-white focus-within:border-stone-300 focus-within:bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]",

  /**
   * Bottom spacing for floating search row (`FloatingSearchDock` + IA follow-up). Same Y as tabs/dock.
   */
  floatingSearchBarRowPad: "pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2",

  /** 13px / leading normal / 70% white — floating search pill + modo IA (incl. `md:text-[13px]` vs `Textarea`). */
  floatingSearchPillText: "text-[13px] leading-normal text-white/70 md:text-[13px]",

  /**
   * Bottom floating search pill — matches `FloatingSearchDock` trigger (no search icon).
   * AI follow-up adds send on the right inside the same shell.
   */
  floatingSearchPill:
    "flex w-full max-w-xl min-h-10 items-center gap-2.5 rounded-full border-0 bg-[#2a2a2a]/75 px-3.5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-colors hover:bg-[#2a2a2a]/85 focus-within:bg-[#2a2a2a]/85",

  narrativeSectionLabel: (light: boolean) =>
    light
      ? "mb-1.5 text-[13px] font-medium leading-snug text-slate-600 tracking-normal"
      : "mb-1.5 text-[13px] font-medium leading-snug text-[#9ca8bb] tracking-normal",

  focusRing: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white/20",
  focusRingInset: "ring-2 ring-white/15 ring-offset-2 ring-offset-[#060708]",

  toggleOnDark: "border-white/[0.12] bg-white/[0.08] text-[#f0f4fa]",
  toggleOnLight: "border-slate-300 bg-slate-100 text-slate-900",

  /** Warm editorial home (Saki-like light storefront) */
  home: {
    /** Section kicker / card label on white — prefer over all-caps eyebrows */
    eyebrow: "text-[13px] font-medium leading-snug text-stone-600 tracking-normal",
    sectionTitle: "text-lg font-semibold leading-tight tracking-tight text-stone-900 sm:text-xl",
    label: "text-[12px] font-medium text-stone-600",
    cardTitle: "text-[14px] font-semibold leading-snug text-stone-900",
    body: "text-[13px] leading-relaxed text-stone-600",
    price: "text-[15px] font-semibold tabular-nums text-stone-900",
    priceMuted: "text-[12px] font-medium text-stone-400 line-through",
    hairline: "border border-stone-200/90",
    focusRing: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-stone-400/40",
  },
};
