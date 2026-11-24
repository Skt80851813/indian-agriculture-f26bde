import * as React from 'react'
import { ImagePlus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  CATEGORIES,
  INDIAN_STATES,
  STATE_HI,
  UNITS,
  type Category,
  type Farmer,
  type Listing,
  type Unit,
} from '@/lib/fixtures'
import { cdnImage, MARKET_TODAY } from '@/lib/format'
import { useI18n, type TranslationKey } from '@/lib/i18n'
import type { ListingInput } from '@/lib/market-store'

const MAX_PHOTOS = 5

type Draft = {
  cropEn: string
  cropHi: string
  variety: string
  category: Category
  quantity: string
  unit: Unit
  price: string
  minOrder: string
  district: string
  state: string
  harvestedOn: string
  organic: boolean
  description: string
  photos: string[]
}

function toDraft(listing: Listing | undefined, farmer: Farmer | undefined): Draft {
  return {
    cropEn: listing?.crop.en ?? '',
    cropHi: listing?.crop.hi ?? '',
    variety: listing?.variety ?? '',
    category: listing?.category ?? 'vegetables',
    quantity: listing ? String(listing.quantity) : '',
    unit: listing?.unit ?? 'kg',
    price: listing ? String(listing.price) : '',
    minOrder: listing ? String(listing.minOrder) : '1',
    district: listing?.district ?? farmer?.district ?? '',
    state: listing?.state ?? farmer?.state ?? '',
    harvestedOn: listing?.harvestedOn ?? MARKET_TODAY,
    organic: listing?.organic ?? false,
    description: listing ? listing.description.en : '',
    photos: listing?.photos ?? [],
  }
}

/** Add / edit dialog for a farmer's crop listing. */
export function ListingFormDialog({
  open,
  onOpenChange,
  listing,
  farmer,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing?: Listing
  farmer?: Farmer
  onSubmit: (input: ListingInput) => void
}) {
  const { t, lang } = useI18n()
  const [draft, setDraft] = React.useState<Draft>(() => toDraft(listing, farmer))
  const [errors, setErrors] = React.useState<Partial<Record<keyof Draft, TranslationKey>>>({})
  const fileRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setDraft(toDraft(listing, farmer))
      setErrors({})
    }
  }, [open, listing, farmer])

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  function addPhotos(files: FileList | null) {
    if (!files) return
    const urls = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, MAX_PHOTOS - draft.photos.length)
      .map((f) => URL.createObjectURL(f))
    set('photos', [...draft.photos, ...urls])
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!draft.cropEn.trim()) next.cropEn = 'form.required'
    if (!(Number(draft.quantity) > 0)) next.quantity = 'form.positive'
    if (!(Number(draft.price) > 0)) next.price = 'form.positive'
    if (!draft.district.trim()) next.district = 'form.required'
    if (!draft.state) next.state = 'form.required'
    if (draft.photos.length === 0) next.photos = 'form.required'
    setErrors(next)
    if (Object.keys(next).length) return

    const description = draft.description.trim()
    onSubmit({
      crop: { en: draft.cropEn.trim(), hi: draft.cropHi.trim() || draft.cropEn.trim() },
      variety: draft.variety.trim() || '—',
      category: draft.category,
      quantity: Number(draft.quantity),
      unit: draft.unit,
      price: Number(draft.price),
      minOrder: Math.max(1, Number(draft.minOrder) || 1),
      district: draft.district.trim(),
      state: draft.state,
      harvestedOn: draft.harvestedOn,
      organic: draft.organic,
      description: {
        en: description,
        hi: listing && listing.description.en === description ? listing.description.hi : description,
      },
      photos: draft.photos,
      mandiPrice: listing?.mandiPrice,
    })
  }

  const selectClass =
    'h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {listing ? t('form.editTitle') : t('form.newTitle')}
          </DialogTitle>
          <DialogDescription>{t('form.desc')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="grid gap-4">
          {/* Photos */}
          <div>
            <Label>{t('form.photos')}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {draft.photos.map((src, i) => (
                <div key={src + i} className="group relative size-20 overflow-hidden rounded-lg border bg-muted">
                  <img src={cdnImage(src, 160)} alt="" className="size-full object-cover" />
                  {i === 0 && (
                    <span className="absolute inset-x-0 bottom-0 bg-brand-deeper/80 text-center text-[10px] text-primary-foreground">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => set('photos', draft.photos.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 rounded-full bg-card/90 p-0.5 shadow"
                    aria-label={`${t('dash.delete')} ${i + 1}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              {draft.photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-invalid={!!errors.photos}
                  className="flex size-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary aria-invalid:border-destructive"
                >
                  <ImagePlus className="size-5" />
                  {t('form.addPhotos')}
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  addPhotos(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t('form.photosHint')}</p>
            {errors.photos && <p className="text-xs text-destructive">{t(errors.photos)}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="cropEn" label={t('form.cropEn')} error={errors.cropEn}>
              <Input
                id="cropEn"
                value={draft.cropEn}
                onChange={(e) => set('cropEn', e.target.value)}
                placeholder="Sharbati Wheat"
                aria-invalid={!!errors.cropEn}
              />
            </FormField>
            <FormField id="cropHi" label={t('form.cropHi')}>
              <Input
                id="cropHi"
                value={draft.cropHi}
                onChange={(e) => set('cropHi', e.target.value)}
                placeholder="शरबती गेहूं"
              />
            </FormField>
            <FormField id="variety" label={t('form.variety')}>
              <Input id="variety" value={draft.variety} onChange={(e) => set('variety', e.target.value)} />
            </FormField>
            <FormField id="category" label={t('form.category')}>
              <select
                id="category"
                value={draft.category}
                onChange={(e) => set('category', e.target.value as Category)}
                className={selectClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`cat.${c}`)}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FormField id="quantity" label={t('form.quantity')} error={errors.quantity}>
              <Input
                id="quantity"
                inputMode="decimal"
                value={draft.quantity}
                onChange={(e) => set('quantity', e.target.value.replace(/[^\d.]/g, ''))}
                aria-invalid={!!errors.quantity}
              />
            </FormField>
            <FormField id="unit" label={t('form.unit')}>
              <select
                id="unit"
                value={draft.unit}
                onChange={(e) => set('unit', e.target.value as Unit)}
                className={selectClass}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {t(`unit.${u}`)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="price" label={t('form.price')} error={errors.price}>
              <Input
                id="price"
                inputMode="decimal"
                value={draft.price}
                onChange={(e) => set('price', e.target.value.replace(/[^\d.]/g, ''))}
                aria-invalid={!!errors.price}
              />
            </FormField>
            <FormField id="minOrder" label={t('form.minOrder')}>
              <Input
                id="minOrder"
                inputMode="decimal"
                value={draft.minOrder}
                onChange={(e) => set('minOrder', e.target.value.replace(/[^\d.]/g, ''))}
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="district" label={t('form.district')} error={errors.district}>
              <Input
                id="district"
                value={draft.district}
                onChange={(e) => set('district', e.target.value)}
                aria-invalid={!!errors.district}
              />
            </FormField>
            <FormField id="state" label={t('form.state')} error={errors.state}>
              <select
                id="state"
                value={draft.state}
                onChange={(e) => set('state', e.target.value)}
                aria-invalid={!!errors.state}
                className={selectClass}
              >
                <option value="" disabled>
                  —
                </option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {lang === 'hi' ? STATE_HI[s] : s}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="harvestedOn" label={t('form.harvested')}>
              <Input
                id="harvestedOn"
                type="date"
                value={draft.harvestedOn}
                max={MARKET_TODAY}
                onChange={(e) => set('harvestedOn', e.target.value)}
              />
            </FormField>
          </div>

          <FormField id="description" label={t('form.description')}>
            <Textarea
              id="description"
              rows={3}
              value={draft.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </FormField>

          <div className="flex items-center justify-between rounded-lg bg-muted p-3">
            <Label htmlFor="organic">{t('form.organic')}</Label>
            <Switch id="organic" checked={draft.organic} onCheckedChange={(v) => set('organic', v)} />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('dash.cancel')}
            </Button>
            <Button type="submit" className="bg-saffron font-semibold text-accent-foreground hover:bg-saffron-strong">
              {listing ? t('form.save') : t('form.publish')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: TranslationKey
  children: React.ReactNode
}) {
  const { t } = useI18n()
  return (
    <div className="grid content-start gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{t(error)}</p>}
    </div>
  )
}
