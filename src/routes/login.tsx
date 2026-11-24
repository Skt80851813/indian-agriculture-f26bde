import * as React from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShoppingBasket, Sprout } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogoMark } from '@/components/site/logo'
import { INDIAN_STATES, STATE_HI } from '@/lib/fixtures'
import { useI18n, type TranslationKey } from '@/lib/i18n'
import { useMarket, type Role } from '@/lib/market-store'
import { cn } from '@/lib/utils'

type Mode = 'signin' | 'register'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode; role?: Role } => ({
    mode: search.mode === 'register' ? 'register' : search.mode === 'signin' ? 'signin' : undefined,
    role: search.role === 'farmer' || search.role === 'customer' ? search.role : undefined,
  }),
  head: () => ({ meta: [{ title: 'Sign in | Kisan Bazaar' }] }),
  component: LoginPage,
})

function LoginPage() {
  const { mode = 'signin', role = 'customer' } = Route.useSearch()
  const navigate = useNavigate({ from: '/login' })
  const { t, lang } = useI18n()
  const { signIn, registerFarmer, registerCustomer } = useMarket()
  const [errors, setErrors] = React.useState<Record<string, TranslationKey>>({})

  const setRole = (next: Role) => navigate({ search: (prev) => ({ ...prev, role: next }), replace: true })
  const isRegister = mode === 'register'

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const next: Record<string, TranslationKey> = {}
    if (data.phone.replace(/\D/g, '').length < 10) next.phone = 'form.required'
    if ((data.password ?? '').length < 6) next.password = 'form.required'
    if (isRegister && !data.name?.trim()) next.name = 'form.required'
    if (isRegister && role === 'farmer') {
      if (!data.district?.trim()) next.district = 'form.required'
      if (!data.state) next.state = 'form.required'
    }
    setErrors(next)
    if (Object.keys(next).length) return

    if (!isRegister) {
      signIn(role)
      toast.success(t('auth.signedIn'))
    } else if (role === 'farmer') {
      registerFarmer({
        name: data.name.trim(),
        nameHi: data.name.trim(),
        phone: data.phone,
        district: data.district.trim(),
        state: data.state,
      })
      toast.success(t('auth.registered'))
    } else {
      registerCustomer(data.name.trim())
      toast.success(t('auth.registered'))
    }
    navigate({ to: role === 'farmer' ? '/farmer' : '/crops' })
  }

  return (
    <div className="grain min-h-[calc(100vh-8rem)] bg-secondary/50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <p className="mt-2 text-sm text-muted-foreground">{t('auth.welcome')}</p>
          <h1 className="font-display text-3xl font-bold">
            {isRegister ? t('auth.registerTitle') : t('auth.signInTitle')}
          </h1>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold">{t('auth.iAm')}</p>
          <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('auth.iAm')}>
            <RoleOption
              active={role === 'farmer'}
              onClick={() => setRole('farmer')}
              icon={<Sprout />}
              title={t('auth.farmer')}
              body={t('auth.farmerPitch')}
            />
            <RoleOption
              active={role === 'customer'}
              onClick={() => setRole('customer')}
              icon={<ShoppingBasket />}
              title={t('auth.customer')}
              body={t('auth.customerPitch')}
            />
          </div>

          <form className="mt-5 grid gap-4" onSubmit={onSubmit} noValidate key={`${mode}-${role}`}>
            {isRegister && (
              <AuthField id="name" label={t('auth.fullName')} error={errors.name}>
                <Input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} />
              </AuthField>
            )}
            <AuthField id="phone" label={t('auth.phone')} error={errors.phone}>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                aria-invalid={!!errors.phone}
              />
            </AuthField>
            {isRegister && role === 'customer' && (
              <AuthField id="email" label={`${t('auth.email')} (${lang === 'hi' ? 'वैकल्पिक' : 'optional'})`}>
                <Input id="email" name="email" type="email" autoComplete="email" />
              </AuthField>
            )}
            {isRegister && role === 'farmer' && (
              <div className="grid grid-cols-2 gap-3">
                <AuthField id="district" label={t('auth.village')} error={errors.district}>
                  <Input id="district" name="district" aria-invalid={!!errors.district} />
                </AuthField>
                <AuthField id="state" label={t('auth.state')} error={errors.state}>
                  <select
                    id="state"
                    name="state"
                    defaultValue=""
                    aria-invalid={!!errors.state}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive"
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
                </AuthField>
              </div>
            )}
            <AuthField id="password" label={t('auth.password')} error={errors.password}>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                aria-invalid={!!errors.password}
              />
            </AuthField>
            <Button type="submit" size="lg" className="mt-1 bg-saffron font-semibold text-accent-foreground hover:bg-saffron-strong">
              {isRegister ? t('auth.submitRegister') : t('auth.submitSignIn')}
            </Button>
            <p className="text-xs text-muted-foreground">{t('auth.terms')}</p>
          </form>
        </div>

        <p className="mt-5 text-center text-sm">
          {isRegister ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
          <Link
            to="/login"
            search={{ mode: isRegister ? 'signin' : 'register', role }}
            className="font-semibold text-primary hover:underline"
          >
            {isRegister ? t('signIn') : t('register')}
          </Link>
        </p>
      </div>
    </div>
  )
}

function RoleOption({
  active,
  onClick,
  icon,
  title,
  body,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none',
        active ? 'border-primary bg-secondary' : 'border-border hover:border-primary/40',
      )}
    >
      <span className={cn('[&_svg]:size-5', active ? 'text-primary' : 'text-muted-foreground')}>{icon}</span>
      <span className="font-display text-base font-bold">{title}</span>
      <span className="text-xs leading-snug text-muted-foreground">{body}</span>
    </button>
  )
}

function AuthField({
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
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{t(error)}</p>}
    </div>
  )
}
