import * as React from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { SearchX, SlidersHorizontal, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ListingCard } from '@/components/site/listing-card'
import { CATEGORIES, STATE_HI, type Category } from '@/lib/fixtures'
import { useI18n } from '@/lib/i18n'
import { filterListings, useMarket, type SortKey } from '@/lib/market-store'

type CropsSearch = {
  q?: string
  cat?: Category
  state?: string
  min?: number
  max?: number
  organic?: boolean
  sort?: SortKey
}

const SORTS: SortKey[] = ['newest', 'priceLow', 'priceHigh', 'qty']

function toNumber(value: unknown) {
  const n = Number(value)
  return value !== undefined && value !== '' && Number.isFinite(n) && n >= 0 ? n : undefined
}

export const Route = createFileRoute('/crops/')({
  validateSearch: (search: Record<string, unknown>): CropsSearch => ({
    q: typeof search.q === 'string' && search.q ? search.q : undefined,
    cat: CATEGORIES.includes(search.cat as Category) ? (search.cat as Category) : undefined,
    state: typeof search.state === 'string' && search.state ? search.state : undefined,
    min: toNumber(search.min),
    max: toNumber(search.max),
    organic: search.organic === true || search.organic === 'true' ? true : undefined,
    sort: SORTS.includes(search.sort as SortKey) ? (search.sort as SortKey) : undefined,
  }),
  head: () => ({ meta: [{ title: 'Browse crops | Kisan Bazaar' }] }),
  component: BrowseCrops,
})

function BrowseCrops() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/crops/' })
  const { t } = useI18n()
  const { listings } = useMarket()

  const results = filterListings(listings, search)
  const activeCount = [search.cat, search.state, search.min, search.max, search.organic].filter(
    (v) => v !== undefined,
  ).length

  const update = (patch: Partial<CropsSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })

  return (
    <div className="mx-auto max-w-content px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {search.cat ? t(`cat.${search.cat}`) : t('browse.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {results.length} {t('browse.results')}
            {search.q && (
              <>
                {' '}
                {t('browse.for')} <span className="font-semibold text-chili">“{search.q}”</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal /> {t('browse.filters')}
                {activeCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{t('browse.filters')}</SheetTitle>
                <SheetDescription className="sr-only">{t('browse.title')}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6">
                <Filters search={search} update={update} />
              </div>
            </SheetContent>
          </Sheet>
          <Label htmlFor="sort" className="sr-only sm:not-sr-only sm:text-sm sm:text-muted-foreground">
            {t('browse.sort')}
          </Label>
          <select
            id="sort"
            value={search.sort ?? 'newest'}
            onChange={(e) => update({ sort: e.target.value as SortKey })}
            className="h-9 rounded-md border bg-card px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {t(`sort.${s}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCount > 0 && <ActiveChips search={search} update={update} />}

      <div className="mt-6 grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <Filters search={search} update={update} />
          </div>
        </aside>

        <section aria-live="polite">
          {results.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <SearchX className="size-7" />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold">{t('browse.emptyTitle')}</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t('browse.emptyBody')}</p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/crops">{t('browse.clear')}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {results.map((listing, i) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  className="rise-in"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function Filters({
  search,
  update,
}: {
  search: CropsSearch
  update: (patch: Partial<CropsSearch>) => void
}) {
  const { t, lang } = useI18n()
  const { listings } = useMarket()
  const states = Array.from(new Set(listings.map((l) => l.state))).sort()
  const [min, setMin] = React.useState(search.min?.toString() ?? '')
  const [max, setMax] = React.useState(search.max?.toString() ?? '')

  React.useEffect(() => {
    setMin(search.min?.toString() ?? '')
    setMax(search.max?.toString() ?? '')
  }, [search.min, search.max])

  return (
    <div className="space-y-7 text-sm">
      <div>
        <h2 className="font-display text-base font-bold">{t('browse.category')}</h2>
        <ul className="mt-2 space-y-0.5">
          <li>
            <FilterOption active={!search.cat} onClick={() => update({ cat: undefined })}>
              {t('allCategories')}
            </FilterOption>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <FilterOption active={search.cat === cat} onClick={() => update({ cat })}>
                {t(`cat.${cat}`)}
                <span className="ml-auto text-xs text-muted-foreground">
                  {listings.filter((l) => l.category === cat).length}
                </span>
              </FilterOption>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-base font-bold">{t('browse.state')}</h2>
        <select
          aria-label={t('browse.state')}
          value={search.state ?? ''}
          onChange={(e) => update({ state: e.target.value || undefined })}
          className="mt-2 h-9 w-full rounded-md border bg-card px-3 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <option value="">{t('browse.anyState')}</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {lang === 'hi' ? (STATE_HI[s] ?? s) : s}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          update({ min: toNumber(min), max: toNumber(max) })
        }}
      >
        <h2 className="font-display text-base font-bold">{t('browse.price')}</h2>
        <div className="mt-2 flex items-center gap-2">
          <Input
            inputMode="numeric"
            aria-label={t('browse.min')}
            placeholder={t('browse.min')}
            value={min}
            onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))}
            className="bg-card"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            inputMode="numeric"
            aria-label={t('browse.max')}
            placeholder={t('browse.max')}
            value={max}
            onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))}
            className="bg-card"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            [0, 50],
            [50, 1000],
            [1000, 5000],
            [5000, undefined],
          ].map(([lo, hi]) => (
            <button
              key={`${lo}-${hi}`}
              type="button"
              onClick={() => update({ min: lo || undefined, max: hi })}
              className="rounded-full border bg-card px-2.5 py-1 text-xs hover:border-primary"
            >
              {hi ? `₹${lo}–₹${hi}` : `₹${lo}+`}
            </button>
          ))}
        </div>
        <Button type="submit" size="sm" variant="secondary" className="mt-3 w-full">
          {t('browse.apply')}
        </Button>
      </form>

      <div className="flex items-center justify-between">
        <Label htmlFor="organic-only" className="font-display text-base font-bold">
          {t('browse.organicOnly')}
        </Label>
        <Switch
          id="organic-only"
          checked={!!search.organic}
          onCheckedChange={(v) => update({ organic: v || undefined })}
        />
      </div>

      <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground">
        <Link to="/crops" search={{ q: search.q }}>
          {t('browse.clear')}
        </Link>
      </Button>
    </div>
  )
}

function FilterOption({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center rounded-md px-2 py-1.5 text-left hover:bg-muted ${
        active ? 'bg-secondary font-semibold text-secondary-foreground' : ''
      }`}
    >
      {children}
    </button>
  )
}

function ActiveChips({
  search,
  update,
}: {
  search: CropsSearch
  update: (patch: Partial<CropsSearch>) => void
}) {
  const { t, lang } = useI18n()
  const chips: { label: string; clear: Partial<CropsSearch> }[] = []
  if (search.cat) chips.push({ label: t(`cat.${search.cat}`), clear: { cat: undefined } })
  if (search.state)
    chips.push({
      label: lang === 'hi' ? (STATE_HI[search.state] ?? search.state) : search.state,
      clear: { state: undefined },
    })
  if (search.min !== undefined || search.max !== undefined)
    chips.push({
      label: `₹${search.min ?? 0} – ${search.max !== undefined ? `₹${search.max}` : '∞'}`,
      clear: { min: undefined, max: undefined },
    })
  if (search.organic) chips.push({ label: t('card.organic'), clear: { organic: undefined } })

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={() => update(chip.clear)}
          className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/70"
        >
          {chip.label} <X className="size-3" />
        </button>
      ))}
    </div>
  )
}
