import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProduct } from '@/lib/mock-data';
import { fetchProduct } from '@/lib/api';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { PageTransition } from '@/components/ui/PageTransition';
import { Link } from '@/lib/i18n/routing';

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { locale } = await params;
  const { product: productId } = await searchParams;

  if (!productId) notFound();

  let product;
  try {
    product = await fetchProduct(productId);
  } catch {
    product = getProduct(productId);
  }
  if (!product || product.price === null || !product.is_available) notFound();

  const t = await getTranslations('checkout');

  return (
    <PageTransition>
      <div className="min-h-screen px-8 md:px-16 py-10 max-w-lg">
        <div className="mb-8">
          <Link
            href={`/shop/${productId}` as any}
            className="font-body text-xs tracking-widest text-warm-400 hover:text-ink transition-colors uppercase"
          >
            ← {locale === 'en' ? 'Back' : '돌아가기'}
          </Link>
        </div>

        <h1 className="font-heading text-3xl font-light tracking-wider text-ink mb-10">
          {t('title')}
        </h1>

        <CheckoutForm product={product} locale={locale} />
      </div>
    </PageTransition>
  );
}
