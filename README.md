# Kisan Bazaar

An Indian agriculture marketplace where farmers list crops (name, quantity, price, location, photos) and customers browse, search, filter and contact farmers directly by phone, WhatsApp or enquiry. Fully bilingual (English / हिंदी) and responsive.

## Tech
TanStack Start (React 19), Tailwind CSS 4, shadcn/ui, lucide icons, deployed on Netlify. Images served through Netlify Image CDN.

## Run locally
```bash
pnpm install
pnpm dev            # http://localhost:3000
# or: netlify dev
```

## Current state
All screens work end to end, but data lives in a client-side store seeded with sample listings (`src/lib/fixtures.ts`), so changes reset on reload and are not shared between visitors.

## Roadmap
See [PLAN.md](PLAN.md): connect Supabase Auth and a shared `listings` table + photo storage, persist enquiries, and document the Supabase setup.
