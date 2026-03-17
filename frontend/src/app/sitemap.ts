import type { MetadataRoute } from 'next';
import { mockArtProducts, mockShopProducts } from '@/lib/mock-data';
import { fetchProducts } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://heeang.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ['', '/art', '/shop', '/info'];
  const locales = ['ko', 'en'];

  let artProducts;
  let shopProducts;
  try {
    [artProducts, shopProducts] = await Promise.all([
      fetchProducts('art'),
      fetchProducts('sale'),
    ]);
  } catch (e) {
    console.warn('[heeang] API fallback:', e);
    artProducts = mockArtProducts;
    shopProducts = mockShopProducts;
  }

  const pages: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      pages.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
      });
    }

    for (const product of artProducts) {
      pages.push({
        url: `${BASE_URL}/${locale}/art/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    for (const product of shopProducts) {
      pages.push({
        url: `${BASE_URL}/${locale}/shop/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return pages;
}
