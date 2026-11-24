import { Link } from '@tanstack/react-router'
import { BadgeCheck, Leaf, MapPin, Star } from 'lucide-react'

import type { Listing } from '@/lib/fixtures'
import { STATE_HI } from '@/lib/fixtures'
import { cdnImage, daysSince, formatINR, formatNumber } from '@/lib/format'
import { useI18n } from '@/lib/i18n'
import { useMarket } from '@/lib/market-store'
import { cn } from '@/lib/utils'

export function ListingCard({
  listing,
  className,
  compact,
  style,
}: {
  listing: Listing
  className?: string
  compact?: boolean
  style?: React.CSSProperties
}) {
  const { t, l, lang } = useI18n()
  const { getFarmer } = useMarket()
  const farmer = getFarmer(listing.farmerId)
  const discount =
    listing.mandiPrice && listing.mandiPrice > listing.price
      ? Math.round(((listing.mandiPrice - listing.price) / listing.mandiPrice) * 100)
      : 0
  const fresh = daysSince(listing.listedOn) <= 2

  return (
    <Link
      to="/crops/$cropId"
      params={{ cropId: listing.id }}
      style={style}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border bg-card outline-none transition-shadow hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {listing.photos[0] && (
          <img
            src={cdnImage(listing.photos[0], compact ? 320 : 480)}
            alt={l(listing.crop)}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {discount > 0 && (
            <span className="rounded-md bg-chili px-1.5 py-0.5 text-[11px] font-bold text-white">
              -{discount}%
            </span>
          )}
          {listing.organic && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
              <Leaf className="size-3" /> {t('card.organic')}
            </span>
          )}
          {fresh && !compact && (
            <span className="rounded-md bg-saffron px-1.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
              {t('nav.nearby')}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-display text-[15px] leading-snug font-semibold group-hover:text-primary sm:text-base">
          {l(listing.crop)}
        </h3>
        {!compact && farmer && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            {lang === 'hi' ? farmer.nameHi : farmer.name}
            {farmer.verified && <BadgeCheck className="size-3.5 text-primary" aria-label={t('card.verified')} />}
            {farmer.reviews > 0 && (
              <span className="ml-1 inline-flex items-center gap-0.5">
                <Star className="size-3 fill-saffron text-saffron" /> {farmer.rating}
              </span>
            )}
          </p>
        )}
        <div className="mt-auto pt-1">
          <p className="flex items-baseline gap-1">
            <span className="font-display text-xl font-bold">{formatINR(listing.price)}</span>
            <span className="text-xs text-muted-foreground">
              / {t(`unit.${listing.unit}`)}
            </span>
          </p>
          {discount > 0 && listing.mandiPrice && !compact && (
            <p className="text-xs text-muted-foreground">
              {t('todaysMandi')}: <span className="line-through">{formatINR(listing.mandiPrice)}</span>
            </p>
          )}
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">
              {listing.district}, {lang === 'hi' ? (STATE_HI[listing.state] ?? listing.state) : listing.state}
            </span>
          </p>
          {!compact && (
            <p className="mt-0.5 text-xs font-medium text-primary">
              {formatNumber(listing.quantity)} {t(`unit.${listing.unit}`)} {t('card.available')}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
