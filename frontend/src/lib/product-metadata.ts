import type { Metadata } from 'next';
import { getProduct } from '@/lib/mock-data';
import { fetchProduct } from '@/lib/api';

/**
 * Shared metadata generator for product detail pages (art and shop).
 */
export async function buildProductMetadata(locale: string, id: string): Promise<Metadata> {
  let product;
  try {
    product = await fetchProduct(id);
  } catch {
    product = getProduct(id);
  }
  if (!product) return {};

  const isKo = locale === 'ko';
  const title = isKo ? product.title_ko : product.title_en;
  const description = isKo ? product.description_ko : product.description_en;
  const ogImage = product.images?.[0]?.variants.medium;

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
