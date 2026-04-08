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

  /**
   * Hairline gradient: só cinzas neutros (R≈G≈B), escuro → mais escuro — equilibrado, sem “sumir”.
   */
  glassChrome: {
    edgePill:
      "bg-gradient-to-b from-[#2a2a2c] via-[#1e1e20] to-[#121214] p-px shadow-[0_8px_28px_rgba(0,0,0,0.22)]",
    edgePanel:
      "bg-gradient-to-b from-[#2a2a2c] via-[#1e1e20] to-[#121214] p-px shadow-[0_12px_40px_-16px_rgba(0,0,0,0.48)]",
    /** Track inside gradient ring (profile switcher, width toggle). */
    fillPill: "rounded-full bg-[#141415]/92 backdrop-blur-md",
    /** Card / panel interior. */
    fillPanel: "rounded-[calc(1.5rem-1px)] bg-[#131314]/94 backdrop-blur-md",
    fillPillInner:
      "relative flex h-9 min-h-9 w-full min-w-0 flex-nowrap items-stretch overflow-x-auto rounded-full bg-[#18181a]/95 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",

    /**
     * Cluster fixo (seletor + card): um único vidro no contorno inteiro (substitui edgePanel opaco + fill empilhados).
     * Presets de largura usam `widthPresetShell` (mesmo vidro, formato pill).
     */
    clusterShell:
      "overflow-hidden rounded-3xl border border-white/[0.11] bg-[#08080a]/30 backdrop-blur-2xl shadow-[0_12px_40px_-16px_rgba(0,0,0,0.48)]",
    /**
     * Faixa das pills dentro do cluster — só tint sutil, sem segundo backdrop-blur (o blur vem do `clusterShell`).
     */
    fillPillTrackCluster:
      "relative flex h-9 min-h-9 w-full min-w-0 flex-nowrap items-stretch overflow-x-auto rounded-full bg-white/[0.05] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",

    /**
     * Presets de largura da vitrine (AppShell): mesmo vidro que `clusterShell`, formato pill.
     */
    widthPresetShell:
      "overflow-hidden rounded-full border border-white/[0.11] bg-[#08080a]/30 backdrop-blur-2xl shadow-[0_12px_40px_-16px_rgba(0,0,0,0.48)]",
    widthPresetTrack:
      "relative inline-flex h-9 min-w-[5.25rem] w-full items-stretch overflow-hidden rounded-full bg-white/[0.05] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
  },

  /** Botões flutuantes fora da vitrine (perfil, largura) — cinza neutro, sem tom azulado do zinc. */
  floatingChrome: {
    segmentActive:
      "bg-[#3d3d40] text-white shadow-[0_1px_2px_rgba(0,0,0,0.38)]",
    segmentInactive: "text-[#b8b8bc] hover:text-[#f0f0f1]",
    segmentFocus:
      "focus-visible:ring-2 focus-visible:ring-[#5a5a5d]/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-canvas)]",
    presetKnob: "bg-[#3d3d40] shadow-[0_1px_2px_rgba(0,0,0,0.38)]",
  },

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

  /** 13px — floating search pill + IA (texto sobre vidro claro). */
  floatingSearchPillText: "text-[13px] leading-normal text-stone-600 md:text-[13px]",

  /**
   * Bottom floating search pill — vidro branco leve (`FloatingSearchDock` + `SearchAiPanel`).
   */
  floatingSearchPill:
    "flex w-full max-w-xl min-h-10 items-center gap-2.5 rounded-full border border-stone-200/60 bg-white/86 backdrop-blur-md px-3.5 text-left shadow-[0_8px_28px_rgba(15,23,42,0.08)] transition-colors hover:bg-white/92 focus-within:bg-white/94",

  /**
   * Prompt estilo ChatGPT: coluna (textarea em cima, barra de ações embaixo), vidro leve (blur + alpha).
   */
  promptInputKit:
    "flex w-full cursor-text flex-col gap-0 rounded-[1.75rem] border border-stone-200/60 bg-white/86 p-3 shadow-[0_8px_28px_rgba(15,23,42,0.08)] backdrop-blur-md backdrop-saturate-150",

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
