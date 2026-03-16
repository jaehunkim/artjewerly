import { describe, it, expect } from 'vitest';
import {
  getProduct,
  mockArtProducts,
  mockShopProducts,
  type Product,
} from '../mock-data';

describe('getProduct', () => {
  it('returns an art product when given a valid art product ID', () => {
    const product = getProduct('art-1');
    expect(product).toBeDefined();
    expect(product?.id).toBe('art-1');
    expect(product?.category).toBe('art');
  });

  it('returns a shop product when given a valid shop product ID', () => {
    const product = getProduct('shop-1');
    expect(product).toBeDefined();
    expect(product?.id).toBe('shop-1');
    expect(product?.category).toBe('sale');
  });

  it('returns undefined when given an invalid ID', () => {
    const product = getProduct('does-not-exist');
    expect(product).toBeUndefined();
  });

  it('returns undefined for an empty string ID', () => {
    const product = getProduct('');
    expect(product).toBeUndefined();
  });
});

describe('mock product data integrity', () => {
  const requiredStringFields: (keyof Product)[] = [
    'id',
    'title_ko',
    'title_en',
    'description_ko',
    'description_en',
    'currency',
  ];

  const allProducts = [...mockArtProducts, ...mockShopProducts];

  it('all mock products have a non-empty id', () => {
    allProducts.forEach((p) => {
      expect(p.id).toBeTruthy();
    });
  });

  it('all mock products have required string fields with non-empty values', () => {
    allProducts.forEach((p) => {
      requiredStringFields.forEach((field) => {
        expect(p[field], `product ${p.id} is missing field ${field}`).toBeTruthy();
      });
    });
  });

  it('all mock products have a valid category of art or sale', () => {
    allProducts.forEach((p) => {
      expect(['art', 'sale']).toContain(p.category);
    });
  });

  it('all mock products have at least one image', () => {
    allProducts.forEach((p) => {
      expect(p.images.length, `product ${p.id} has no images`).toBeGreaterThan(0);
    });
  });

  it('all art products have null price', () => {
    mockArtProducts.forEach((p) => {
      expect(p.price).toBeNull();
      expect(p.price_usd).toBeNull();
    });
  });

  it('all shop products have a numeric price', () => {
    mockShopProducts.forEach((p) => {
      expect(typeof p.price).toBe('number');
    });
  });
});
