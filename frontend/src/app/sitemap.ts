import type { MetadataRoute } from 'next';
import { mockArtProducts, mockShopProducts } from '@/lib/mock-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://heeang.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/art', '/shop', '/info'];
  const locales = ['ko', 'en'];

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

    for (const product of mockArtProducts) {
      pages.push({
        url: `${BASE_URL}/${locale}/art/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    for (const product of mockShopProducts) {
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
