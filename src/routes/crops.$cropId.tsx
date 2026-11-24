import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  Leaf,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ListingCard } from '@/components/site/listing-card'
import { STATE_HI, type Farmer, type Listing } from '@/lib/fixtures'
import {
  cdnImage,
  formatDate,
  formatINR,
  formatNumber,
  telLink,
  whatsappLink,
} from '@/lib/format'
import { useI18n } from '@/lib/i18n'
import { useMarket } from '@/lib/market-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/crops/$cropId')({
  component: CropDetail,
})

function CropDetail() {
  const { cropId } = Route.useParams()
  const { t, l, lang } = useI18n()
  const { getListing, getFarmer, listings } = useMarket()
  const listing = getListing(cropId)
  const [photo, setPhoto] = React.useState(0)

  React.useEffect(() => setPhoto(0), [cropId])

  if (!listing) {
    return (
      <div className="mx-auto flex max-w-reading flex-col items-center px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">{t('browse.emptyTitle')}</h1>
        <p className="mt-2 text-muted-foreground">{t('browse.emptyBody')}</p>
        <Button asChild className="mt-6">
          <Link to="/crops">{t('browseAll')}</Link>
        </Button>
      </div>
    )
  }

  const farmer = getFarmer(listing.farmerId)
  const unit = t(`unit.${listing.unit}`)
  const stateLabel = lang === 'hi' ? (STATE_HI[listing.state] ?? listing.state) : listing.state
  const discount =
    listing.mandiPrice && listing.mandiPrice > listing.price
      ? Math.round(((listing.mandiPrice - listing.price) / listing.mandiPrice) * 100)
      : 0
  const fromFarmer = listings.filter((x) => x.farmerId === listing.farmerId && x.id !== listing.id)
  const similar = listings
    .filter((x) => x.category === listing.category && x.id !== listing.id && x.farmerId !== listing.farmerId)
    .slice(0, 6)

  return (
    <div className="mx-auto max-w-content px-4 py-5 sm:px-6">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/crops" className="inline-flex items-center gap-0.5 hover:text-primary hover:underline">
          <ChevronLeft className="size-4" /> {t('detail.back')}
        </Link>
        <span aria-hidden>·</span>
        <Link to="/crops" search={{ cat: listing.category }} className="hover:text-primary hover:underline">
          {t(`cat.${listing.category}`)}
        </Link>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_1fr_20rem]">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row lg:col-span-1">
          {listing.photos.length > 1 && (
            <div className="flex gap-2 sm:flex-col">
              {listing.photos.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setPhoto(i)}
                  aria-label={`${l(listing.crop)} ${i + 1}`}
                  className={cn(
                    'size-16 overflow-hidden rounded-lg border-2 bg-muted',
                    i === photo ? 'border-saffron' : 'border-transparent opacity-75 hover:opacity-100',
                  )}
                >
                  <img src={cdnImage(src, 128)} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1 overflow-hidden rounded-2xl bg-muted">
            {listing.photos[photo] && (
              <img
                src={cdnImage(listing.photos[photo], 900, 78)}
                alt={l(listing.crop)}
                className="aspect-square w-full object-cover"
              />
            )}
            {listing.organic && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Leaf className="size-3.5" /> {t('card.organic')}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="font-display text-3xl leading-tight font-bold sm:text-4xl">{l(listing.crop)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('form.variety')}: {listing.variety}
          </p>
          {farmer && (
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-medium text-primary">{lang === 'hi' ? farmer.nameHi : farmer.name}</span>
              {farmer.verified && (
                <span className="inline-flex items-center gap-0.5 text-xs text-primary">
                  <BadgeCheck className="size-4" /> {t('card.verified')}
                </span>
              )}
              {farmer.reviews > 0 && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Stars value={farmer.rating} /> {farmer.rating} ({farmer.reviews})
                </span>
              )}
            </p>
          )}

          <div className="mt-5 border-y py-4">
            {discount > 0 && (
              <span className="rounded bg-chili px-2 py-0.5 text-xs font-bold text-white">
                -{discount}% · {t('home.dealTag')}
              </span>
            )}
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold">{formatINR(listing.price)}</span>
              <span className="text-muted-foreground">
                {t('card.perUnit')} {unit}
              </span>
            </p>
            {listing.mandiPrice && discount > 0 && (
              <p className="text-sm text-muted-foreground">
                {t('todaysMandi')}: <span className="line-through">{formatINR(listing.mandiPrice)}</span>
              </p>
            )}
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <Fact icon={<Package />} label={t('detail.quantity')} value={`${formatNumber(listing.quantity)} ${unit}`} />
            <Fact icon={<Scale />} label={t('detail.minOrder')} value={`${formatNumber(listing.minOrder)} ${unit}`} />
            <Fact icon={<MapPin />} label={t('detail.location')} value={`${listing.district}, ${stateLabel}`} />
            <Fact icon={<CalendarDays />} label={t('detail.harvested')} value={formatDate(listing.harvestedOn, lang)} />
          </dl>

          <div className="mt-6">
            <h2 className="font-display text-lg font-bold">{t('detail.about')}</h2>
            <p className="mt-1 leading-relaxed text-foreground/85">{l(listing.description)}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {t('detail.listed')}: {formatDate(listing.listedOn, lang)}
            </p>
          </div>
        </div>

        {/* Contact box */}
        {farmer && <ContactBox listing={listing} farmer={farmer} />}
      </div>

      {fromFarmer.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">{t('detail.moreFromFarmer')}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {fromFarmer.map((x) => (
              <ListingCard key={x.id} listing={x} compact />
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">{t('detail.similar')}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {similar.map((x) => (
              <ListingCard key={x.id} listing={x} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ContactBox({ listing, farmer }: { listing: Listing; farmer: Farmer }) {
  const { t, l, lang } = useI18n()
  const [qty, setQty] = React.useState(String(listing.minOrder))
  const qtyNumber = Math.max(0, Number(qty) || 0)
  const unit = t(`unit.${listing.unit}`)
  const waMessage =
    lang === 'hi'
      ? `नमस्ते ${farmer.name}, मैंने किसान बाज़ार पर आपकी "${l(listing.crop)}" लिस्टिंग देखी। मुझे ${qtyNumber} ${unit} चाहिए। क्या यह उपलब्ध है?`
      : `Namaste ${farmer.name}, I saw your "${listing.crop.en}" listing on Kisan Bazaar. I need ${qtyNumber} ${unit}. Is it available?`

  return (
    <aside className="h-fit rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-32">
      <h2 className="font-display text-lg font-bold">{t('detail.contactFarmer')}</h2>
      <div className="mt-3 flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary font-display text-lg font-bold text-secondary-foreground">
          {farmer.name
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{lang === 'hi' ? farmer.nameHi : farmer.name}</p>
          <p className="text-xs text-muted-foreground">
            {farmer.district}, {lang === 'hi' ? (STATE_HI[farmer.state] ?? farmer.state) : farmer.state}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('detail.memberSince')} {farmer.memberSince}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="qty" className="text-xs text-muted-foreground">
          {t('detail.enquiryQty')} ({unit})
        </Label>
        <Input
          id="qty"
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(e.target.value.replace(/[^\d.]/g, ''))}
          className="mt-1"
        />
        <p className="mt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">{t('detail.estimate')}</span>
          <span className="font-display text-lg font-bold">{formatINR(qtyNumber * listing.price)}</span>
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <Button asChild size="lg" className="bg-saffron font-semibold text-accent-foreground hover:bg-saffron-strong">
          <a href={telLink(farmer.phone)}>
            <Phone /> {t('detail.call')}
          </a>
        </Button>
        <Button asChild size="lg" className="font-semibold">
          <a href={whatsappLink(farmer.phone, waMessage)} target="_blank" rel="noreferrer">
            <MessageCircle /> {t('detail.whatsapp')}
          </a>
        </Button>
        <EnquiryDialog listing={listing} defaultQty={qty} />
      </div>
      <p className="mt-3 text-center font-mono text-sm tracking-wide text-muted-foreground">{farmer.phone}</p>
      <p className="mt-4 flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary" /> {t('detail.safety')}
      </p>
    </aside>
  )
}

function EnquiryDialog({ listing, defaultQty }: { listing: Listing; defaultQty: string }) {
  const { t, l } = useI18n()
  const { session } = useMarket()
  const [open, setOpen] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, boolean>>({})

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <Send /> {t('detail.sendEnquiry')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('detail.sendEnquiry')}</DialogTitle>
          <DialogDescription>{l(listing.crop)}</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            const next = {
              name: !String(data.get('name') ?? '').trim(),
              phone: String(data.get('phone') ?? '').replace(/\D/g, '').length < 10,
            }
            setErrors(next)
            if (next.name || next.phone) return
            setOpen(false)
            toast.success(t('detail.enquirySent'))
          }}
        >
          <Field id="enq-name" label={t('detail.enquiryName')} error={errors.name}>
            <Input id="enq-name" name="name" defaultValue={session?.name} aria-invalid={errors.name} />
          </Field>
          <Field id="enq-phone" label={t('detail.enquiryPhone')} error={errors.phone}>
            <Input id="enq-phone" name="phone" type="tel" placeholder="+91" aria-invalid={errors.phone} />
          </Field>
          <Field id="enq-qty" label={`${t('detail.enquiryQty')} (${t(`unit.${listing.unit}`)})`}>
            <Input id="enq-qty" name="qty" inputMode="numeric" defaultValue={defaultQty} />
          </Field>
          <Field id="enq-msg" label={t('detail.enquiryMsg')}>
            <Textarea id="enq-msg" name="message" rows={3} />
          </Field>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              <Send /> {t('detail.sendEnquiry')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: boolean
  children: React.ReactNode
}) {
  const { t } = useI18n()
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{t('form.required')}</p>}
    </div>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-2.5 rounded-xl bg-muted/70 p-3">
      <span className="mt-0.5 text-primary [&_svg]:size-4">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-semibold">{value}</dd>
      </div>
    </div>
  )
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn('size-3.5', i <= Math.round(value) ? 'fill-saffron text-saffron' : 'text-border')}
        />
      ))}
    </span>
  )
}
