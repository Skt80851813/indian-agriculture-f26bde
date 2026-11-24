import * as React from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Eye, MessageSquareText, Package, Pencil, Plus, Sprout, Trash2, Wheat } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ListingFormDialog } from '@/components/site/listing-form'
import type { Listing } from '@/lib/fixtures'
import { cdnImage, formatDate, formatINR, formatNumber } from '@/lib/format'
import { useI18n } from '@/lib/i18n'
import { useMarket } from '@/lib/market-store'

export const Route = createFileRoute('/farmer')({
  head: () => ({ meta: [{ title: 'Farmer dashboard | Kisan Bazaar' }] }),
  component: FarmerDashboard,
})

function FarmerDashboard() {
  const { t, l, lang } = useI18n()
  const { session, signIn, listings, getFarmer, createListing, updateListing, deleteListing } = useMarket()
  const [editing, setEditing] = React.useState<Listing | undefined>()
  const [formOpen, setFormOpen] = React.useState(false)
  const [toDelete, setToDelete] = React.useState<Listing | undefined>()

  if (session?.role !== 'farmer' || !session.farmerId) {
    return (
      <div className="grain bg-secondary/50 px-4 py-20">
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Sprout className="size-7" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold">{t('dash.signInTitle')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('dash.signInBody')}</p>
          <div className="mt-6 grid gap-2">
            <Button asChild size="lg" className="bg-saffron font-semibold text-accent-foreground hover:bg-saffron-strong">
              <Link to="/login" search={{ mode: 'signin', role: 'farmer' }}>
                {t('signIn')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login" search={{ mode: 'register', role: 'farmer' }}>
                {t('register')}
              </Link>
            </Button>
            <Button variant="link" size="sm" onClick={() => signIn('farmer')}>
              {lang === 'hi' ? 'नमूना किसान खाते से देखें' : 'Preview with a sample farmer account'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const farmer = getFarmer(session.farmerId)
  const mine = listings.filter((x) => x.farmerId === session.farmerId)
  const stockValue = mine.reduce((sum, x) => sum + x.quantity * x.price, 0)

  const openNew = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {t('hello')}, {lang === 'hi' && farmer ? farmer.nameHi : session.name}
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{t('dash.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('dash.subtitle')}</p>
        </div>
        <Button size="lg" onClick={openNew} className="bg-saffron font-semibold text-accent-foreground hover:bg-saffron-strong">
          <Plus /> {t('dash.addListing')}
        </Button>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={<Wheat />} label={t('dash.activeListings')} value={String(mine.length)} />
        <StatTile icon={<Package />} label={t('dash.totalStock')} value={formatINR(stockValue)} />
        <StatTile icon={<MessageSquareText />} label={t('dash.enquiries')} value={mine.length ? String(mine.length * 3 + 2) : '0'} />
        <StatTile icon={<Eye />} label={t('dash.views')} value={formatNumber(mine.length * 187 + (mine.length ? 41 : 0))} />
      </dl>

      <section className="mt-8">
        <h2 className="font-display text-xl font-bold">{t('myListings')}</h2>
        {mine.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
              <Sprout className="size-7" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">{t('dash.emptyTitle')}</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t('dash.emptyBody')}</p>
            <Button className="mt-5" onClick={openNew}>
              <Plus /> {t('dash.addListing')}
            </Button>
          </div>
        ) : (
          <ul className="mt-4 divide-y overflow-hidden rounded-2xl border bg-card">
            {mine.map((x) => (
              <li key={x.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <Link
                  to="/crops/$cropId"
                  params={{ cropId: x.id }}
                  className="flex min-w-0 flex-1 items-center gap-4 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <img
                    src={cdnImage(x.photos[0], 160)}
                    alt=""
                    className="size-16 shrink-0 rounded-lg object-cover sm:size-20"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-semibold hover:text-primary">{l(x.crop)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(x.quantity)} {t(`unit.${x.unit}`)} · {x.district}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('detail.listed')}: {formatDate(x.listedOn, lang)}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="text-right">
                    <span className="font-display text-xl font-bold">{formatINR(x.price)}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t('card.perUnit')} {t(`unit.${x.unit}`)}
                    </span>
                  </p>
                  <div className="flex gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(x)
                        setFormOpen(true)
                      }}
                    >
                      <Pencil /> {t('dash.edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setToDelete(x)}
                      aria-label={`${t('dash.delete')} ${l(x.crop)}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ListingFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        listing={editing}
        farmer={farmer}
        onSubmit={(input) => {
          if (editing) {
            updateListing(editing.id, input)
            toast.success(t('dash.saved'))
          } else {
            createListing(input)
            toast.success(t('dash.created'))
          }
          setFormOpen(false)
        }}
      />

      <Dialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(undefined)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dash.deleteConfirm')}</DialogTitle>
            <DialogDescription>
              {toDelete && <span className="font-semibold text-foreground">{l(toDelete.crop)}. </span>}
              {t('dash.deleteBody')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setToDelete(undefined)}>
              {t('dash.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (toDelete) deleteListing(toDelete.id)
                setToDelete(undefined)
                toast.success(t('dash.deleted'))
              }}
            >
              <Trash2 /> {t('dash.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-primary [&_svg]:size-4">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-bold">{value}</dd>
    </div>
  )
}
