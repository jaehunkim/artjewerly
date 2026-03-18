import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, mockShopProducts } from '@/lib/mock-data';
import { fetchProduct, fetchProducts } from '@/lib/api';
import { buildProductMetadata } from '@/lib/product-metadata';
import { ProductDetail } from '@/components/product/ProductDetail';
import { PageTransition } from '@/components/ui/PageTransition';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  return buildProductMetadata(locale, id);
}

interface ShopDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { locale, id } = await params;

  let product;
  try {
    product = await fetchProduct(id);
  } catch (e) {
    console.warn('[heeang] API fallback:', e);
    product = getProduct(id);
  }

  if (!product || product.category !== 'sale') {
    notFound();
  }

  return (
    <PageTransition>
      <ProductDetail product={product} locale={locale} />
    </PageTransition>
  );
}
