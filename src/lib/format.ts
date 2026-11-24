import type { Lang } from '@/lib/i18n'

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})
const num = new Intl.NumberFormat('en-IN')

export const formatINR = (value: number) => inr.format(value)
export const formatNumber = (value: number) => num.format(value)

/**
 * Serve site images through the Netlify Image CDN so pages never ship the
 * full-resolution originals. Uploaded previews (blob:/data: URLs) pass through.
 */
export function cdnImage(src: string, width: number, quality = 72) {
  if (!src.startsWith('/')) return src
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp&q=${quality}`
}

export function formatDate(iso: string, lang: Lang) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Days between an ISO date and "today" for the marketplace (fixed for stable SSR output). */
export function daysSince(iso: string, today = MARKET_TODAY) {
  const ms = new Date(today + 'T00:00:00').getTime() - new Date(iso + 'T00:00:00').getTime()
  return Math.max(0, Math.round(ms / 86_400_000))
}

export const MARKET_TODAY = '2026-11-23'

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/\s/g, '')}`
}
