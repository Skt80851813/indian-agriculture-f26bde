# Kisan Bazaar — Plan

1. [x] Brand, theme, Hindi/English language switch, responsive header/footer
2. [x] Amazon-style homepage with category cards, deals, fresh arrivals, shop by state
3. [x] Browse/search page with filters (name, category, state, price range, organic) and sorting
4. [x] Crop detail page with photos, facts, call / WhatsApp / enquiry contact
5. [x] Farmer & Customer sign-in/registration screens (UI, client-side session)
6. [x] Farmer dashboard: add, edit, delete listings with photo upload (client-side store)
7. [ ] Supabase project: `profiles` (role farmer/customer) and `listings` tables with row-level security, `crop-photos` storage bucket
8. [ ] Replace `src/lib/market-store.tsx` internals with Supabase Auth + queries (screens already only use this store)
9. [ ] Persist enquiries to Supabase and show them in the farmer dashboard
10. [ ] Supabase setup guide in README, env vars `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` on Netlify
