# AGENTS.md

Kisan Bazaar: TanStack Start + React 19 + Tailwind 4 + shadcn/ui marketplace on Netlify. Remaining work is tracked in **PLAN.md** — start there.

## Layout
- `src/routes/` — `index.tsx` (homepage), `crops.index.tsx` (browse, filters in URL search params), `crops.$cropId.tsx` (detail + contact), `login.tsx` (farmer/customer sign-in & register, `?mode=&role=`), `farmer.tsx` (dashboard CRUD), `__root.tsx` (shell, providers, fonts).
- `src/components/site/` — header (search, language toggle, account menu), footer, listing card, listing form dialog, logo.
- `src/lib/i18n.tsx` — `useI18n()` gives `t(key)` for UI strings (add keys to both `en` and `hi`) and `l(text)` for `{en, hi}` data.
- `src/lib/market-store.tsx` — the single data layer (listings, farmers, session, CRUD, `filterListings`). Screens only use this; swap its internals for Supabase without touching UI.
- `src/lib/fixtures.ts` — sample farmers/listings, states (with Hindi names), categories, units.
- `src/lib/format.ts` — INR formatting, `cdnImage()` Netlify Image CDN helper, tel/WhatsApp links, fixed `MARKET_TODAY` for stable SSR.
- `public/img/` — generated crop and hero photos.

## Conventions
- Use theme classes (`bg-brand-deep`, `bg-saffron`, `text-chili`, `font-display`) defined in `src/styles.css`.
- Read `localStorage` only in `useEffect` (SSR).
- Uploaded photos are currently `blob:` URLs; they need Supabase Storage to persist.
