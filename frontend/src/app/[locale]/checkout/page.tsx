'use client';

import { useCartStore } from '@/store/cart';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { PageTransition } from '@/components/ui/PageTransition';
import { Link } from '@/lib/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

export default function CheckoutPage() {
  const locale = useLocale();
  const t = useTranslations('checkout');
  const { items } = useCartStore();
  const isKo = locale === 'ko';

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen px-8 md:px-16 py-10 text-center space-y-6">
          <p className="font-body text-sm text-warm-400">
            {isKo ? '장바구니가 비어 있습니다' : 'Your cart is empty'}
          </p>
          <Link
            href="/shop"
            className="inline-block font-body text-xs tracking-[0.2em] uppercase px-8 py-4 border border-ink text-ink hover:bg-ink hover:text-cream transition-colors duration-300"
          >
            {isKo ? '쇼핑 계속하기' : 'Continue Shopping'}
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen px-8 md:px-16 py-10 max-w-lg">
        <div className="mb-8">
          <Link
            href="/cart"
            className="font-body text-xs tracking-widest text-warm-400 hover:text-ink transition-colors uppercase"
          >
            ← {isKo ? '장바구니' : 'Cart'}
          </Link>
        </div>

        <h1 className="font-heading text-3xl font-light tracking-wider text-ink mb-10">
          {t('title')}
        </h1>

        <CheckoutForm items={items} locale={locale} />
      </div>
    </PageTransition>
  );
}
