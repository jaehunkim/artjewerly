'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="font-body text-xs tracking-widest text-warm-400 hover:text-ink transition-colors"
    >
      {locale === 'ko' ? 'EN' : 'KR'}
    </button>
  );
}
