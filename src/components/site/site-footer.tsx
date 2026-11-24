import { Link } from '@tanstack/react-router'
import { Phone } from 'lucide-react'

import { LogoMark } from '@/components/site/logo'
import { CATEGORIES } from '@/lib/fixtures'
import { useI18n } from '@/lib/i18n'

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="mt-16 text-primary-foreground">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="block w-full bg-primary py-3 text-sm font-medium hover:bg-primary/90"
      >
        {t('footer.backToTop')}
      </button>
      <div className="bg-brand-deep">
        <div className="mx-auto grid max-w-content gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="font-display text-2xl font-bold">{t('brand')}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">{t('footer.about')}</p>
            <a
              href="tel:18001801551"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
            >
              <Phone className="size-4 text-saffron" /> {t('footer.helpline')}: 1800 180 1551
            </a>
          </div>
          <FooterCol title={t('footer.buy')}>
            <Link to="/crops">{t('browseAll')}</Link>
            {CATEGORIES.map((cat) => (
              <Link key={cat} to="/crops" search={{ cat }}>
                {t(`cat.${cat}`)}
              </Link>
            ))}
          </FooterCol>
          <FooterCol title={t('footer.sell')}>
            <Link to="/login" search={{ mode: 'register', role: 'farmer' }}>
              {t('sellCrops')}
            </Link>
            <Link to="/farmer">{t('farmerDashboard')}</Link>
            <Link to="/login" search={{ mode: 'signin', role: 'farmer' }}>
              {t('signIn')}
            </Link>
          </FooterCol>
          <FooterCol title={t('footer.help')}>
            <Link to="/" hash="how-it-works">
              {t('footer.howItWorks')}
            </Link>
            <Link to="/" hash="how-it-works">
              {t('footer.safety')}
            </Link>
          </FooterCol>
        </div>
      </div>
      <div className="bg-brand-deeper py-4 text-center text-xs text-primary-foreground/60">
        © 2026 {t('brand')} · {t('footer.rights')}
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-base font-bold">{title}</h2>
      <div className="mt-3 flex flex-col gap-2 text-sm text-primary-foreground/75 [&_a:hover]:text-primary-foreground [&_a:hover]:underline">
        {children}
      </div>
    </div>
  )
}
