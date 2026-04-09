# Future Store — design tokens (single reference)

This document inventories **typography, color, shadow, background, motion, and layering** used across the app.  
**Code sources of truth** remain in the paths below; update this file when you change those sources.

---

## Where styles live in code

| Area | Primary files |
|------|----------------|
| Global CSS variables, Tailwind theme bridge, base layers | `src/app/globals.css` |
| Dark chrome, glass, floating controls, light storefront copy | `src/lib/ui-tokens.ts` (`ui` export) |
| Narrative sidebar typography & rail surfaces | `src/lib/narrativeSidebar.ts` |
| Sheet / drawer motion (Framer) | `src/lib/storefrontSheetMotion.ts` |
| Font loading & CSS variables | `src/app/layout.tsx` |
| shadcn / radix semantic colors | `src/app/globals.css` (`:root`, `.dark`, `html[data-theme="light"]`) |

---

## Fonts

**Single family:** [Geist](https://vercel.com/font), loaded in `layout.tsx` as `--font-sans` via `next/font/google`.

| Variable | Role |
|----------|------|
| `--font-sans` | **Geist** — entire UI (`font-sans` on `html` / `body`) |

**Body:** `font-sans` (Geist), `antialiased`.  
**OpenType (global):** `font-feature-settings: "ss01" on, "cv11" on` on `body` (`globals.css`).

**Storefront frame:** `[data-storefront-window]` uses fluid type:

```txt
clamp(0.9375rem, calc(0.8rem + 0.18cqw), 1rem)  /* ~15–16px, scales with container */
```

---

## CSS variables (`globals.css`)

### `:root` (default dark surround)

| Token | Value | Usage |
|-------|--------|--------|
| `--app-canvas` | `#111111` | Page background behind storefront (matches `#121212` chrome, neutral) |
| `--radius` | `0.625rem` | Base radius; Tailwind `radius-*` scale derives from this |
| `--background`, `--foreground`, etc. | oklch… | shadcn semantic palette |

### `html[data-theme="light"]`

| Token | Value |
|-------|--------|
| `--background` | `#e4e4e4` |
| `--foreground` | `#0f1419` |
| `--app-canvas` | `#dcdcdc` |

### `.dark` class

Overrides shadcn tokens to dark semantic colors (see `globals.css` for full oklch list).

### Tailwind v4 `@theme inline`

Maps `--color-*` and `--radius-*` to the variables above (`globals.css`).

---

## Typography — dark chrome (`ui` in `ui-tokens.ts`)

Used for presenter shell, overlays on `#121212`, profile cluster, etc.

| Role | Classes / notes |
|------|------------------|
| Eyebrow | `text-[14px] font-medium leading-snug text-[#9ca8b8] tracking-normal` |
| Section title | `text-lg font-semibold leading-tight tracking-tight text-[#eef1f6] sm:text-xl` |
| Label | `text-[14px] font-medium text-[#9ca8b8]` |
| Card title | `text-[14px] font-semibold leading-snug text-[#e8ecf4]` |
| Body | `text-[15px] leading-relaxed text-[#b8c0ce] sm:text-[16px]` |
| Price | `text-[15px] font-semibold tabular-nums text-[#eef1f6]` |
| Price muted | `text-[14px] font-medium text-[#7d8898] line-through` |

## Typography — light storefront (`ui.home`)

| Role | Notes |
|------|--------|
| Eyebrow pill | `text-[14px] font-normal tracking-normal text-[#666]` |
| Section title | `text-lg font-semibold … text-stone-900 sm:text-xl` |
| Label / card title / body / price | stone scale (`stone-600`, `stone-900`, etc.) |
| Hairline | `border-stone-200/90` |

## Typography — narrative sidebar (`narrativeSidebar.ts`)

| Role | Classes |
|------|---------|
| Section / stage labels | `text-[12px] font-medium leading-tight tracking-[-0.04em]` (Geist) |
| Shopper name | `text-[16px] font-medium leading-tight tracking-[-0.04em]` (Geist) |

## Floating search / light glass (`ui`)

| Role | Size |
|------|------|
| Floating search pill text | `text-[14px] … text-stone-600` |

---

## Colors — dark UI chrome (hex / alpha)

| Token / usage | Value |
|----------------|--------|
| Default hairline | `border-white/[0.06]` |
| Glass gradient edge (pill/panel) | `from-[#2a2a2c] via-[#1e1e20] to-[#121214]` |
| Fill pill | `bg-[#141415]/92` |
| Fill panel | `bg-[#131314]/94` |
| Fill pill inner | `bg-[#18181a]/95` |
| Cluster shell | `border-white/[0.11] bg-[#08080a]/30` |
| Segment active | `bg-[#4a4a4f] text-white` |
| Segment inactive | `text-[#b8b8bc]` hover `text-[#f0f0f1]` |
| Focus ring | `ring-[#5a5a5d]/75`, offset `var(--app-canvas)` |
| Preset knob | `bg-[#3d3d40]` |
| Search bar (dark) | `bg-[#14161c]/90` → hover/focus `border-white/[0.08–0.09]`, `bg-[#161922]/95` |
| Toggle on dark | `border-white/[0.12] bg-white/[0.08] text-[#f0f4fa]` |
| Focus ring (dark inset) | `ring-white/15 ring-offset-[#060708]` |
| Sidebar rail active | `border-white/[0.14] bg-white/[0.08] text-[#f4f6fa]` |
| Sidebar rail inactive | `text-[#9aa3b0]` → hover `text-[#c8d0dc]` |

## Colors — light floating / sheets (stone)

Common patterns: `border-stone-200/60–90`, `bg-white/86–95`, `text-stone-900`, `shadow` with `rgba(15,23,42,…)` (slate-ish shadow).

## Colors — storefront shell

| Usage | Value |
|--------|--------|
| Storefront inner window | `bg-[#121212]` |
| Welcome / loading overlay | `bg-[#0c0c0c]` |
| App shell body | `bg-[var(--app-canvas)]` |

## Colors — AI agent profile (WebGL hero frame)

| Usage | Value |
|--------|--------|
| Hero wrapper | `bg-[#050a18]`, `border-indigo-400/15` |
| WebGL clear | `rgb(0.012, 0.022, 0.055)` |

---

## Shadows (recurring)

| Context | Shadow (Tailwind arbitrary) |
|---------|---------------------------|
| Cluster glass shell | `shadow-[0_12px_40px_-16px_rgba(0,0,0,0.48)]` |
| Glass edge pill | `shadow-[0_8px_28px_rgba(0,0,0,0.22)]` |
| Glass edge panel | `shadow-[0_12px_40px_-16px_rgba(0,0,0,0.48)]` |
| Segment active | `shadow-[0_1px_2px_rgba(0,0,0,0.32)]` |
| Preset knob | `shadow-[0_1px_2px_rgba(0,0,0,0.38)]` |
| Pill inner inset | `shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]` |
| Track inset | `shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]` |
| Sidebar active inset | `shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]` |
| Floating search / prompt | `shadow-[0_8px_28px_rgba(15,23,42,0.08)]` |
| Storefront device frame | `shadow-[0_24px_56px_-28px_rgba(0,0,0,0.18)]` |
| Cart bottom sheet | `shadow-[0_-12px_48px_-18px_rgba(15,23,42,0.2)]` |
| Presenter modal | `shadow-2xl` |

---

## Backgrounds & blur

| Pattern | Notes |
|---------|--------|
| Glass cluster | `backdrop-blur-2xl` + low alpha fills |
| Search bar dark | `backdrop-blur-xl` |
| Fill pill / panel | `backdrop-blur-md` / `backdrop-blur-sm` |
| Light prompt kit | `backdrop-blur-md backdrop-saturate-150` |
| Cart sheet | `backdrop-blur-xl backdrop-saturate-100` |
| Presenter panel | `backdrop-blur-2xl` |

---

## Border radius (common)

| Pattern | Value |
|---------|--------|
| shadcn base `--radius` | `0.625rem` → `radius-sm` … `radius-4xl` in `@theme` |
| Storefront window | `rounded-[1.75rem]` outer, inner `rounded-[calc(1.75rem-2px)]` |
| Glass cluster | `rounded-3xl` |
| Pills / tracks | `rounded-full` |
| Prompt / light chrome | `rounded-[1.75rem]` |
| Agent bento tiles | `rounded-3xl` |
| Cart sheet top | `rounded-t-[1.5rem] sm:rounded-t-[1.75rem]` |

---

## Motion — storefront sheets (`storefrontSheetMotion.ts`)

| Token | Duration | Easing (cubic-bezier as array) |
|-------|----------|----------------------------------|
| Backdrop | 0.3s | `[0.4, 0, 0.2, 1]` |
| Backdrop exit | 0.22s | `[0.4, 0, 1, 1]` |
| Right panel | 0.48s | `[0.22, 1, 0.36, 1]` |
| Right panel exit | 0.4s | `[0.4, 0, 0.2, 1]` |
| Panel slide distance (right sheet) | `28 * 16` px (`max-w-md`) | |
| RayX panel slide | `32 * 16` px | |

(Cart bottom sheet uses local tweens in `StorefrontCartOverlay.tsx` + clip-path enter.)

---

## Z-index stack (storefront & shell)

Approximate layering (low → high):

| z-index | Usage |
|---------|--------|
| `1` | PDP tint, cart sheet content layer |
| `20` | Floating prompt dock on cart sheet |
| `50` | RayX overlay, PDP chat overlay |
| `60` | Storefront right sheet (default) |
| `70` | Refine drawer, fullscreen exit control |
| `75` | Cart overlay |
| `80` | Presenter backdrop |
| `81` | Presenter panel |
| `85` | Floating search dock, AI vision overlay |
| `100` | Storefront portal host |
| `200` | Home loading reveal |
| `250` | Home welcome gate |
| `280` | Fixed shell controls (width presets, profile, reset) |

---

## Utilities (`globals.css`)

| Class | Behavior |
|-------|-----------|
| `.scrollbar-none` | Hides scrollbars, keeps scrolling |

---

## Selection

`::selection { background: rgba(255, 255, 255, 0.14); }`

---

## Reduced motion

- `prefers-reduced-motion: reduce` → `html { scroll-behavior: auto; }`
- Several components use Framer `useReducedMotion()` for shorter transitions (e.g. `HomeWelcomeGate`, `AgentWebGLHero` freezes shader time).

---

### Maintenance

When adding a **new global color, shadow, or type scale**, prefer:

1. Extending `ui` in `ui-tokens.ts` for Tailwind class strings, **or**
2. Adding a CSS variable in `globals.css` if it must be theme-switched.

Then add a row or section here so this file stays the **human-readable map** of the design system.
