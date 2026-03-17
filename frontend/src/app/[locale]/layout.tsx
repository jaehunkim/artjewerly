import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';
import { Sidebar } from '@/components/layout/Sidebar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { fontVariables } from '@/app/layout';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://heeang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === 'ko';

  return {
    title: {
      default: 'Heeang Jewelry',
      template: '%s | Heeang Jewelry',
    },
    description: isKo
      ? '아트 주얼리 & 파인 주얼리 — 희앙'
      : 'Art Jewelry & Fine Jewelry — Heeang',
    openGraph: {
      siteName: 'Heeang Jewelry',
      locale: isKo ? 'ko_KR' : 'en_US',
      type: 'website',
      description: isKo
        ? '아트 주얼리 & 파인 주얼리 — 희앙'
        : 'Art Jewelry & Fine Jewelry — Heeang',
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        ko: `${BASE_URL}/ko`,
        en: `${BASE_URL}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={fontVariables}>
      <body className="bg-cream text-ink">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen">
            <Sidebar />
            <CartDrawer />
            <main className="flex-1 ml-0 md:ml-[140px]">
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
