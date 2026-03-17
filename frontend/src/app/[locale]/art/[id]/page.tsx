import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, mockArtProducts } from '@/lib/mock-data';
import { fetchProduct, fetchProducts } from '@/lib/api';
import { buildProductMetadata } from '@/lib/product-metadata';
import { ProductDetail } from '@/components/product/ProductDetail';
import { PageTransition } from '@/components/ui/PageTransition';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  return buildProductMetadata(locale, id);
}

interface ArtDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await fetchProducts('art');
    return products.map((p) => ({ id: p.id }));
  } catch (e) {
    console.warn('[heeang] API fallback:', e);
    return mockArtProducts.map((p) => ({ id: p.id }));
  }
}

export default async function ArtDetailPage({ params }: ArtDetailPageProps) {
  const { locale, id } = await params;

  let product;
  try {
    product = await fetchProduct(id);
  } catch (e) {
    console.warn('[heeang] API fallback:', e);
    product = getProduct(id);
  }

  if (!product || product.category !== 'art') {
    notFound();
  }

  return (
    <PageTransition>
      <ProductDetail product={product} locale={locale} />
    </PageTransition>
  );
}
