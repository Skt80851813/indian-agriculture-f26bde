import * as React from 'react'

import {
  FARMERS,
  LISTINGS,
  PREVIEW_FARMER_ID,
  type Category,
  type Farmer,
  type Listing,
} from '@/lib/fixtures'
import { MARKET_TODAY } from '@/lib/format'

/**
 * Client-side marketplace store for the product surface.
 * Screens only talk to this module (listings, farmers, session, CRUD), so the
 * fixtures can be replaced by the shared database without touching the UI.
 */

export type Role = 'farmer' | 'customer'
export type Session = { role: Role; name: string; farmerId?: string } | null

export type ListingInput = Omit<Listing, 'id' | 'farmerId' | 'listedOn'>

export type SortKey = 'newest' | 'priceLow' | 'priceHigh' | 'qty'

export interface ListingFilters {
  q?: string
  cat?: Category
  state?: string
  min?: number
  max?: number
  organic?: boolean
  sort?: SortKey
}

type MarketContextValue = {
  listings: Listing[]
  farmers: Farmer[]
  session: Session
  getListing: (id: string) => Listing | undefined
  getFarmer: (id: string) => Farmer | undefined
  createListing: (input: ListingInput) => Listing
  updateListing: (id: string, input: ListingInput) => void
  deleteListing: (id: string) => void
  signIn: (role: Role, name?: string) => void
  registerFarmer: (farmer: Omit<Farmer, 'id' | 'memberSince' | 'rating' | 'reviews' | 'verified'>) => void
  registerCustomer: (name: string) => void
  signOut: () => void
}

const MarketContext = React.createContext<MarketContextValue | null>(null)

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = React.useState<Listing[]>(LISTINGS)
  const [farmers, setFarmers] = React.useState<Farmer[]>(FARMERS)
  const [session, setSession] = React.useState<Session>(null)

  const value = React.useMemo<MarketContextValue>(
    () => ({
      listings,
      farmers,
      session,
      getListing: (id) => listings.find((l) => l.id === id),
      getFarmer: (id) => farmers.find((f) => f.id === id),
      createListing: (input) => {
        const listing: Listing = {
          ...input,
          id: `${slugify(input.crop.en) || 'crop'}-${Date.now().toString(36)}`,
          farmerId: session?.farmerId ?? PREVIEW_FARMER_ID,
          listedOn: MARKET_TODAY,
        }
        setListings((prev) => [listing, ...prev])
        return listing
      },
      updateListing: (id, input) =>
        setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...input } : l))),
      deleteListing: (id) => setListings((prev) => prev.filter((l) => l.id !== id)),
      signIn: (role, name) => {
        if (role === 'farmer') {
          const farmer = farmers.find((f) => f.id === PREVIEW_FARMER_ID)!
          setSession({ role, name: name || farmer.name, farmerId: farmer.id })
        } else {
          setSession({ role, name: name || 'Priya Sharma' })
        }
      },
      registerFarmer: (input) => {
        const farmer: Farmer = {
          ...input,
          id: `f-${slugify(input.name)}-${Date.now().toString(36)}`,
          memberSince: 2026,
          rating: 0,
          reviews: 0,
          verified: false,
        }
        setFarmers((prev) => [...prev, farmer])
        setSession({ role: 'farmer', name: farmer.name, farmerId: farmer.id })
      },
      registerCustomer: (name) => setSession({ role: 'customer', name }),
      signOut: () => setSession(null),
    }),
    [listings, farmers, session],
  )

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
}

export function useMarket() {
  const ctx = React.useContext(MarketContext)
  if (!ctx) throw new Error('useMarket must be used inside MarketProvider')
  return ctx
}

/** Search across English and Hindi crop names, variety, district and state. */
export function filterListings(listings: Listing[], f: ListingFilters) {
  const q = f.q?.trim().toLowerCase()
  const result = listings.filter((l) => {
    if (f.cat && l.category !== f.cat) return false
    if (f.state && l.state !== f.state) return false
    if (f.min != null && l.price < f.min) return false
    if (f.max != null && l.price > f.max) return false
    if (f.organic && !l.organic) return false
    if (q) {
      const haystack = [l.crop.en, l.crop.hi, l.variety, l.district, l.state].join(' ').toLowerCase()
      if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false
    }
    return true
  })
  const sort = f.sort ?? 'newest'
  return [...result].sort((a, b) => {
    if (sort === 'priceLow') return a.price - b.price
    if (sort === 'priceHigh') return b.price - a.price
    if (sort === 'qty') return b.quantity - a.quantity
    return b.listedOn.localeCompare(a.listedOn)
  })
}
