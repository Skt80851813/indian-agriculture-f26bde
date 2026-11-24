import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ChevronDown,
  Languages,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Search,
  Sprout,
  UserRound,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LogoMark } from '@/components/site/logo'
import { CATEGORIES, type Category } from '@/lib/fixtures'
import { useI18n } from '@/lib/i18n'
import { useMarket } from '@/lib/market-store'

export function SiteHeader() {
  const { t, lang, toggleLang } = useI18n()
  const { session, signOut } = useMarket()

  return (
    <header className="sticky top-0 z-40 text-primary-foreground shadow-md">
      <div className="bg-brand-deep">
        <div className="mx-auto flex max-w-content items-center gap-2 px-3 py-2 sm:gap-4 sm:px-6">
          <MobileMenu />
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            <LogoMark />
            <span className="leading-none">
              <span className="block font-display text-xl font-bold tracking-tight sm:text-2xl">
                {t('brand')}
              </span>
              <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-saffron sm:block">
                {t('tagline')}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1.5 rounded-md px-2 py-1 text-sm lg:flex">
            <MapPin className="size-4 text-saffron" />
            <span className="leading-tight">
              <span className="block text-xs opacity-70">{t('deliverTo')}</span>
              <span className="font-semibold">{t('allIndia')}</span>
            </span>
          </div>

          <SearchBar className="hidden flex-1 md:flex" />

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLang}
              className="gap-1.5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              aria-label={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            >
              <Languages className="size-4" />
              <span className="font-semibold">{lang === 'en' ? 'हिं' : 'EN'}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 rounded-md px-2 py-1 text-left text-sm outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-saffron">
                  <UserRound className="size-5 sm:hidden" />
                  <span className="hidden leading-tight sm:block">
                    <span className="block max-w-36 truncate text-xs opacity-75">
                      {session ? `${t('hello')}, ${session.name.split(' ')[0]}` : t('helloGuest')}
                    </span>
                    <span className="flex items-center gap-0.5 font-semibold">
                      {t('accountAndLists')} <ChevronDown className="size-3.5" />
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                {session ? (
                  <>
                    <DropdownMenuLabel>
                      {session.name}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {session.role === 'farmer' ? t('auth.farmer') : t('auth.customer')}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {session.role === 'farmer' && (
                      <DropdownMenuItem asChild>
                        <Link to="/farmer">
                          <LayoutDashboard /> {t('farmerDashboard')}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/crops">
                        <Search /> {t('browseAll')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={signOut}>
                      <LogOut /> {t('signOut')}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="p-2">
                      <Button asChild className="w-full bg-saffron text-accent-foreground hover:bg-saffron/90">
                        <Link to="/login" search={{ mode: 'signin' }}>
                          {t('signIn')}
                        </Link>
                      </Button>
                      <p className="mt-2 text-center text-xs text-muted-foreground">
                        {t('auth.noAccount')}{' '}
                        <Link
                          to="/login"
                          search={{ mode: 'register' }}
                          className="font-semibold text-primary underline-offset-2 hover:underline"
                        >
                          {t('register')}
                        </Link>
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/login" search={{ mode: 'register', role: 'farmer' }}>
                        <Sprout /> {t('sellCrops')}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              asChild
              size="sm"
              className="hidden bg-saffron font-semibold text-accent-foreground hover:bg-saffron/90 lg:inline-flex"
            >
              {session?.role === 'farmer' ? (
                <Link to="/farmer">
                  <Sprout /> {t('farmerDashboard')}
                </Link>
              ) : (
                <Link to="/login" search={{ mode: 'register', role: 'farmer' }}>
                  <Sprout /> {t('sellCrops')}
                </Link>
              )}
            </Button>
          </div>
        </div>
        <div className="px-3 pb-2.5 md:hidden">
          <SearchBar />
        </div>
      </div>

      <nav className="bg-brand-deeper" aria-label="Categories">
        <div className="no-scrollbar mx-auto flex max-w-content items-center gap-1 overflow-x-auto px-3 py-1.5 text-sm sm:px-6">
          <NavPill to="/crops" label={t('browseAll')} bold />
          {CATEGORIES.map((cat) => (
            <NavPill key={cat} to="/crops" search={{ cat }} label={t(`cat.${cat}`)} />
          ))}
          <NavPill to="/crops" search={{ organic: true }} label={t('nav.organic')} />
          <NavPill to="/crops" search={{ sort: 'newest' }} label={t('nav.nearby')} />
          <NavPill to="/crops" search={{ sort: 'qty' }} label={t('nav.bulk')} />
          <span className="ml-auto hidden shrink-0 pl-4 font-semibold text-saffron lg:block">
            {t('footer.helpline')}: 1800 180 1551
          </span>
        </div>
      </nav>
    </header>
  )
}

type CropsSearch = {
  q?: string
  cat?: Category
  state?: string
  organic?: boolean
  sort?: 'newest' | 'priceLow' | 'priceHigh' | 'qty'
}

function NavPill({
  to,
  search,
  label,
  bold,
}: {
  to: '/crops'
  search?: CropsSearch
  label: string
  bold?: boolean
}) {
  return (
    <Link
      to={to}
      search={search ?? {}}
      activeOptions={{ includeSearch: true }}
      className={`shrink-0 rounded-md px-2.5 py-1 whitespace-nowrap outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-saffron data-[status=active]:bg-white/10 ${bold ? 'font-semibold' : ''}`}
    >
      {label}
    </Link>
  )
}

export function SearchBar({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [q, setQ] = React.useState('')
  const [cat, setCat] = React.useState<'' | Category>('')

  return (
    <form
      role="search"
      className={`flex h-10 w-full overflow-hidden rounded-lg bg-card text-foreground ring-saffron focus-within:ring-[3px] ${className}`}
      onSubmit={(e) => {
        e.preventDefault()
        navigate({
          to: '/crops',
          search: { q: q.trim() || undefined, cat: cat || undefined },
        })
      }}
    >
      <label className="sr-only" htmlFor="search-category">
        {t('browse.category')}
      </label>
      <select
        id="search-category"
        value={cat}
        onChange={(e) => setCat(e.target.value as '' | Category)}
        className="max-w-28 shrink-0 cursor-pointer border-r border-border bg-muted px-2 text-xs text-muted-foreground outline-none hover:text-foreground sm:max-w-none sm:text-sm"
      >
        <option value="">{t('allCategories')}</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {t(`cat.${c}`)}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="search-q">
        {t('searchButton')}
      </label>
      <input
        id="search-q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="flex w-12 shrink-0 items-center justify-center bg-saffron text-accent-foreground transition-colors hover:bg-saffron-strong motion-reduce:transition-none"
        aria-label={t('searchButton')}
      >
        <Search className="size-5" />
      </button>
    </form>
  )
}

function MobileMenu() {
  const { t, toggleLang } = useI18n()
  const { session } = useMarket()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-ml-1 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground md:hidden"
          aria-label="Menu"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 gap-0 p-0">
        <SheetHeader className="bg-brand-deep text-primary-foreground">
          <SheetTitle className="flex items-center gap-2 text-primary-foreground">
            <UserRound className="size-5" />
            {session ? `${t('hello')}, ${session.name.split(' ')[0]}` : t('helloGuest')}
          </SheetTitle>
          <SheetDescription className="text-primary-foreground/70">{t('tagline')}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col p-2 text-sm">
          <p className="px-3 pt-3 pb-1 font-display text-base font-bold">{t('home.shopByCategory')}</p>
          <SheetClose asChild>
            <Link to="/crops" className="rounded-md px-3 py-2.5 hover:bg-muted">
              {t('browseAll')}
            </Link>
          </SheetClose>
          {CATEGORIES.map((cat) => (
            <SheetClose asChild key={cat}>
              <Link to="/crops" search={{ cat }} className="rounded-md px-3 py-2.5 hover:bg-muted">
                {t(`cat.${cat}`)}
              </Link>
            </SheetClose>
          ))}
          <div className="my-2 border-t" />
          <SheetClose asChild>
            {session?.role === 'farmer' ? (
              <Link to="/farmer" className="rounded-md px-3 py-2.5 font-semibold text-primary hover:bg-muted">
                {t('farmerDashboard')}
              </Link>
            ) : (
              <Link
                to="/login"
                search={{ mode: 'register', role: 'farmer' }}
                className="rounded-md px-3 py-2.5 font-semibold text-primary hover:bg-muted"
              >
                {t('sellCrops')}
              </Link>
            )}
          </SheetClose>
          {!session && (
            <SheetClose asChild>
              <Link to="/login" search={{ mode: 'signin' }} className="rounded-md px-3 py-2.5 hover:bg-muted">
                {t('signIn')}
              </Link>
            </SheetClose>
          )}
          <button onClick={toggleLang} className="rounded-md px-3 py-2.5 text-left hover:bg-muted">
            {t('language')}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
