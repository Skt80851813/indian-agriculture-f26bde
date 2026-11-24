import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, ChevronRight, HandCoins, Languages, Sprout } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ListingCard } from '@/components/site/listing-card'
import { CATEGORY_IMAGES, STATE_HI, type Category } from '@/lib/fixtures'
import { cdnImage, formatINR } from '@/lib/format'
import type { Listing } from '@/lib/fixtures'
import { useI18n } from '@/lib/i18n'
import { filterListings, useMarket } from '@/lib/market-store'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { t, l, lang } = useI18n()
  const { listings, farmers } = useMarket()

  const fresh = filterListings(listings, { sort: 'newest' }).slice(0, 10)
  const deals = listings
    .filter((x) => x.mandiPrice && x.mandiPrice > x.price)
    .sort((a, b) => (b.mandiPrice! - b.price) / b.mandiPrice! - (a.mandiPrice! - a.price) / a.mandiPrice!)
  const organic = listings.filter((x) => x.organic).slice(0, 6)
  const topDeal = deals[0]
  const states = Array.from(new Set(listings.map((x) => x.state)))
  const districts = new Set(listings.map((x) => x.district)).size

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={cdnImage('/img/hero.png', 1600, 75)}
          srcSet={`${cdnImage('/img/hero.png', 800, 70)} 800w, ${cdnImage('/img/hero.png', 1600, 75)} 1600w`}
          sizes="100vw"
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-deeper/90 via-brand-deeper/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="mx-auto max-w-content px-4 pt-10 pb-36 sm:px-6 sm:pt-16 md:pb-52">
          <div className="max-w-xl text-primary-foreground">
            <span className="rise-in inline-flex items-center gap-1.5 rounded-full bg-saffron/95 px-3 py-1 text-xs font-bold tracking-wide text-accent-foreground uppercase">
              <Sprout className="size-3.5" /> {t('hero.kicker')}
            </span>
            <h1
              className="rise-in mt-4 font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              {t('hero.title')}
            </h1>
            <p
              className="rise-in mt-4 max-w-md text-base text-primary-foreground/85 sm:text-lg"
              style={{ animationDelay: '160ms' }}
            >
              {t('hero.subtitle')}
            </p>
            <div className="rise-in mt-6 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
              <Button asChild size="lg" className="bg-saffron text-base font-semibold text-accent-foreground hover:bg-saffron-strong">
                <Link to="/crops">
                  {t('hero.ctaBrowse')} <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-base text-primary-foreground backdrop-blur hover:bg-white/20 hover:text-primary-foreground"
              >
                <Link to="/login" search={{ mode: 'register', role: 'farmer' }}>
                  {t('hero.ctaSell')}
                </Link>
              </Button>
            </div>
            <dl className="rise-in mt-8 flex gap-6 sm:gap-10" style={{ animationDelay: '320ms' }}>
              <Stat value={`${farmers.length * 412 + 17}`} label={t('hero.stat1')} />
              <Stat value={`${districts * 9 + 4}`} label={t('hero.stat2')} />
              <Stat value="0%" label={t('hero.stat3')} />
            </dl>
          </div>
        </div>
      </section>

      {/* Overlapping category cards, marketplace style */}
      <section className="relative z-10 mx-auto -mt-28 max-w-content px-4 sm:px-6 md:-mt-40">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CategoryQuadCard category="vegetables" />
          <CategoryStackCard category="grains" />
          {topDeal && (
            <div className="flex flex-col rounded-xl bg-card p-4 shadow-sm">
              <h2 className="font-display text-xl font-bold">{t('home.bestPrices')}</h2>
              <Link
                to="/crops/$cropId"
                params={{ cropId: topDeal.id }}
                className="group mt-3 flex flex-1 flex-col outline-none"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={cdnImage(topDeal.photos[0], 480)}
                    alt={l(topDeal.crop)}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded bg-chili px-2 py-0.5 text-xs font-bold text-white">
                    -{Math.round(((topDeal.mandiPrice! - topDeal.price) / topDeal.mandiPrice!) * 100)}%
                  </span>
                  <span className="text-xs font-semibold text-chili">{t('home.dealTag')}</span>
                </div>
                <p className="mt-1 font-semibold group-hover:text-primary">{l(topDeal.crop)}</p>
                <p className="text-sm">
                  <span className="font-display text-lg font-bold">{formatINR(topDeal.price)}</span>{' '}
                  <span className="text-muted-foreground">/ {t(`unit.${topDeal.unit}`)}</span>
                </p>
              </Link>
              <Link to="/crops" search={{ sort: 'priceLow' }} className="mt-3 text-sm font-semibold text-primary hover:underline">
                {t('home.seeAll')}
              </Link>
            </div>
          )}
          <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-sm">
            <div className="p-4 pb-0">
              <h2 className="font-display text-xl font-bold">{t('sellCrops')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('auth.farmerPitch')}</p>
              <Button asChild className="mt-3 w-full bg-saffron font-semibold text-accent-foreground hover:bg-saffron-strong">
                <Link to="/login" search={{ mode: 'register', role: 'farmer' }}>
                  {t('home.farmerBandCta')}
                </Link>
              </Button>
            </div>
            <img
              src={cdnImage('/img/farmer.png', 520)}
              alt=""
              className="mt-4 min-h-40 w-full flex-1 object-cover object-[center_30%]"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <CategoryStackCard category="fruits" wide />
          <CategoryStackCard category="spices" wide />
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto mt-8 max-w-content px-4 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
          <Trust icon={<BadgeCheck />} title={t('home.trust1')} sub={t('home.trust1Sub')} />
          <Trust icon={<HandCoins />} title={t('home.trust2')} sub={t('home.trust2Sub')} />
          <Trust icon={<Languages />} title={t('home.trust3')} sub={t('home.trust3Sub')} />
        </div>
      </section>

      {/* Fresh arrivals carousel */}
      <section className="mx-auto mt-10 max-w-content px-4 sm:px-6">
        <div className="rounded-xl bg-card p-4 shadow-sm sm:p-5">
          <RowHeader title={t('home.freshArrivals')} sub={t('home.freshArrivalsSub')} />
          <div className="no-scrollbar -mx-1 mt-4 flex snap-x gap-3 overflow-x-auto px-1 pb-1">
            {fresh.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                className="w-44 shrink-0 snap-start sm:w-52"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Farmer band / how it works */}
      <section id="how-it-works" className="mx-auto mt-10 max-w-content scroll-mt-32 px-4 sm:px-6">
        <div className="grain relative grid overflow-hidden rounded-2xl bg-secondary md:grid-cols-[1.1fr_1fr]">
          <div className="p-6 sm:p-10">
            <h2 className="font-display text-3xl leading-tight font-extrabold text-secondary-foreground sm:text-4xl">
              {t('home.farmerBandTitle')}
            </h2>
            <p className="mt-3 max-w-lg text-secondary-foreground/80">{t('home.farmerBandBody')}</p>
            <ol className="mt-6 space-y-3">
              {(['home.how1', 'home.how2', 'home.how3'] as const).map((key, i) => (
                <li key={key} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-secondary-foreground">{t(key)}</span>
                </li>
              ))}
            </ol>
            <Button asChild size="lg" className="mt-7 font-semibold">
              <Link to="/login" search={{ mode: 'register', role: 'farmer' }}>
                {t('home.farmerBandCta')} <ArrowRight />
              </Link>
            </Button>
            <p className="mt-4 text-sm text-secondary-foreground/70">{t('detail.safety')}</p>
          </div>
          <div className="relative min-h-64">
            <img
              src={cdnImage('/img/farmer.png', 900)}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Deals grid */}
      <section className="mx-auto mt-10 max-w-content px-4 sm:px-6">
        <RowHeader title={t('home.bestPrices')} link={{ search: { sort: 'priceLow' } }} />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {deals.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Shop by state */}
      <section className="mx-auto mt-10 max-w-content px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold">{t('home.byState')}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {states.map((state) => {
            const count = listings.filter((x) => x.state === state).length
            return (
              <Link
                key={state}
                to="/crops"
                search={{ state }}
                className="group inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-secondary motion-reduce:transition-none"
              >
                {lang === 'hi' ? (STATE_HI[state] ?? state) : state}
                <span className="rounded-full bg-muted px-2 text-xs text-muted-foreground group-hover:bg-card">
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Organic */}
      <section className="mx-auto mt-10 max-w-content px-4 sm:px-6">
        <RowHeader title={t('home.organicPicks')} link={{ search: { organic: true } }} />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {organic.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-2xl font-extrabold text-saffron sm:text-3xl">{value}</dd>
      <dd className="text-xs text-primary-foreground/75 sm:text-sm">{label}</dd>
    </div>
  )
}

function Trust({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 bg-card px-5 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary [&_svg]:size-5">
        {icon}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted-foreground">{sub}</span>
      </span>
    </div>
  )
}

function RowHeader({
  title,
  sub,
  link,
}: {
  title: string
  sub?: string
  link?: { search: { sort?: 'priceLow'; organic?: boolean } }
}) {
  const { t } = useI18n()
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
      </div>
      <Link
        to="/crops"
        search={link?.search ?? { sort: 'newest' }}
        className="flex shrink-0 items-center text-sm font-semibold text-primary hover:underline"
      >
        {t('home.seeAll')} <ChevronRight className="size-4" />
      </Link>
    </div>
  )
}

function CategoryQuadCard({ category }: { category: Category }) {
  const { t, l } = useI18n()
  const { listings } = useMarket()
  const items = listings.filter((x) => x.category === category)
  const tiles = CATEGORY_IMAGES[category].slice(0, 4).map((img) => ({
    img,
    listing: items.find((x) => x.photos[0] === img),
  }))
  return (
    <div className="flex flex-col rounded-xl bg-card p-4 shadow-sm">
      <h2 className="font-display text-xl font-bold">{t(`cat.${category}`)}</h2>
      <div className="mt-3 grid flex-1 grid-cols-2 gap-3">
        {tiles.map(({ img, listing }) => (
          <TileLink key={img} listing={listing} category={category} className="group text-xs outline-none">
            <img
              src={cdnImage(img, 240)}
              alt=""
              className="aspect-square w-full rounded-md object-cover transition-opacity group-hover:opacity-90"
            />
            <span className="mt-1 line-clamp-1 block group-hover:text-primary">
              {listing ? l(listing.crop) : t(`cat.${category}`)}
            </span>
          </TileLink>
        ))}
      </div>
      <Link to="/crops" search={{ cat: category }} className="mt-3 text-sm font-semibold text-primary hover:underline">
        {t('home.seeAll')}
      </Link>
    </div>
  )
}

function CategoryStackCard({ category, wide }: { category: Category; wide?: boolean }) {
  const { t, l } = useI18n()
  const { listings } = useMarket()
  const items = listings.filter((x) => x.category === category)
  const lowest = items.length ? Math.min(...items.map((x) => x.price)) : 0
  const sample = items[0]

  if (wide) {
    return (
      <Link
        to="/crops"
        search={{ cat: category }}
        className="group grid grid-cols-[1fr_1.2fr] overflow-hidden rounded-xl bg-card shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        <div className="flex flex-col justify-center p-5">
          <h2 className="font-display text-2xl font-bold">{t(`cat.${category}`)}</h2>
          {sample && <p className="mt-1 text-sm text-muted-foreground">{items.map((x) => l(x.crop)).slice(0, 3).join(' · ')}</p>}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline">
            {t('home.seeAll')} ({items.length}) <ChevronRight className="size-4" />
          </span>
        </div>
        <div className="grid grid-cols-2">
          {CATEGORY_IMAGES[category].slice(0, 2).map((img) => (
            <img
              key={img}
              src={cdnImage(img, 320)}
              alt=""
              loading="lazy"
              className="aspect-[3/4] size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
            />
          ))}
        </div>
      </Link>
    )
  }

  return (
    <div className="flex flex-col rounded-xl bg-card p-4 shadow-sm">
      <h2 className="font-display text-xl font-bold">{t(`cat.${category}`)}</h2>
      <div className="mt-3 flex flex-1 flex-col gap-3">
        {CATEGORY_IMAGES[category].slice(0, 2).map((img) => {
          const listing = items.find((x) => x.photos[0] === img)
          return (
            <TileLink
              key={img}
              listing={listing}
              category={category}
              className="group relative flex-1 overflow-hidden rounded-md outline-none"
            >
              <img
                src={cdnImage(img, 480)}
                alt=""
                className="aspect-[16/9] size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
              {listing && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deeper/85 to-transparent px-3 pt-6 pb-2 text-sm font-semibold text-primary-foreground">
                  {l(listing.crop)}
                </span>
              )}
            </TileLink>
          )
        })}
      </div>
      <Link to="/crops" search={{ cat: category }} className="mt-3 text-sm font-semibold text-primary hover:underline">
        {t('home.seeAll')} · {formatINR(lowest)}+
      </Link>
    </div>
  )
}

function TileLink({
  listing,
  category,
  className,
  children,
}: {
  listing?: Listing
  category: Category
  className: string
  children: React.ReactNode
}) {
  if (listing) {
    return (
      <Link to="/crops/$cropId" params={{ cropId: listing.id }} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <Link to="/crops" search={{ cat: category }} className={className}>
      {children}
    </Link>
  )
}
