<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Storefront UI (this repo)

- **Responsive layout inside the device frame:** the storefront shell is a CSS **`@container`** (`AppShell` `data-storefront-container`). For “narrow vs wide **storefront**” (including mobile width preset on a large monitor), prefer **`@md:` / `@lg:`** container variants — not plain **`sm:` / `md:` / `lg:`** viewport breakpoints, which follow the browser window.
- **Editing copy:** UI is **bilingual** (default **Portuguese**). English strings live in `src/lib/locales/en.ts`; Portuguese in `src/lib/locales/pt-BR.ts`. Product PT overlays in `src/lib/locales/products-pt.ts`. `useT()` / `getMessage()` route by `uiLocale` in the demo store (`src/store/demoStore.ts`). Legacy `messages` export is the English tree.
- **Section kickers / eyebrows on white/light surfaces:** use `<EyebrowPill>` from `@/components/shared/EyebrowPill` (same look as home — soft gray pill, sentence case, tight tracking). Use `as="h2"` / `as="p"` when you need semantics.
- **Do not** introduce new `uppercase` + `tracking-[0.2em]` (or similar) eyebrow styles; they are legacy.
- **Small column labels** (not full section kickers): `ui.home.label` from `@/lib/ui-tokens`.
- **Offline:** `public/sw.js` registers in production (`next start` / deploy). Use `NEXT_PUBLIC_OFFLINE_SW_DEV=1` to enable the SW in `next dev`. After `next build`, `postbuild` writes `public/precache-manifest.json` (gitignored); the SW install fetches every listed URL (routes, `/_next/static/*`, `public/*`) so one online session can fill the cache without visiting each page manually. LLM uses catalog fallbacks when the API is unavailable; the SW also returns synthetic `skipped` JSON for `/api/*` when the network fails.
