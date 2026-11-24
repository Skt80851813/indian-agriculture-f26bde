import { cn } from '@/lib/utils'

/** Kisan Bazaar mark: a sprouting seed inside a sun disc. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn('size-9 shrink-0', className)}>
      <circle cx="20" cy="20" r="19" fill="var(--saffron)" />
      <path d="M4 27c5-3 11-4 16-4s11 1 16 4v1a19 19 0 0 1-32 0Z" fill="var(--primary)" />
      <path
        d="M20 25V14"
        stroke="var(--brand-deeper)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M20 17c-1-4.5-4.5-6.5-8.5-6 0 4 3 6.8 8.5 6Z" fill="var(--brand-deeper)" />
      <path d="M20 14.5c1-4.5 4.5-6.5 8.5-6 0 4-3 6.8-8.5 6Z" fill="var(--brand-deeper)" />
    </svg>
  )
}
