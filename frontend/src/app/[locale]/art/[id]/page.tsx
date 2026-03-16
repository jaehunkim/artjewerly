import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, mockArtProducts } from '@/lib/mock-data';
import { ProductDetail } from '@/components/product/ProductDetail';
import { PageTransition } from '@/components/ui/PageTransition';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const product = getProduct(id);
  if (!product) return {};

  const isKo = locale === 'ko';
  const title = isKo ? product.title_ko : product.title_en;
  const description = isKo ? product.description_ko : product.description_en;
  const ogImage = product.images[0]?.variants.medium;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

interface ArtDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  return mockArtProducts.map((p) => ({ id: p.id }));
}

export default async function ArtDetailPage({ params }: ArtDetailPageProps) {
  const { locale, id } = await params;
  const product = getProduct(id);

  if (!product || product.category !== 'art') {
    notFound();
  }

  return (
    <PageTransition>
      <ProductDetail product={product} locale={locale} />
    </PageTransition>
  );
}
