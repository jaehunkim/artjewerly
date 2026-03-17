import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import type { Product } from '@/lib/mock-data';

// Mock the i18n routing Link
vi.mock('@/lib/i18n/routing', () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const artProduct: Product = {
  id: 'art-1',
  category: 'art',
  title_ko: '달빛 반지',
  title_en: 'Moonlight Ring',
  description_ko: '아트 피스 설명',
  description_en: 'Art piece description',
  price: null,
  price_usd: null,
  currency: 'KRW',
  is_available: true,
  images: [
    {
      id: 'img-1',
      r2_key: 'placeholder/img-1',
      variants: {
        thumbnail: 'https://example.com/thumb.jpg',
        medium: 'https://example.com/medium.jpg',
        large: 'https://example.com/large.jpg',
        blur: 'data:image/png;base64,abc',
      },
      alt_ko: '주얼리 이미지',
      alt_en: 'Jewelry image',
      sort_order: 0,
    },
  ],
};

const saleProduct: Product = {
  id: 'shop-1',
  category: 'sale',
  title_ko: '미니멀 골드 링',
  title_en: 'Minimal Gold Ring',
  description_ko: '상품 설명',
  description_en: 'Product description',
  price: 180000,
  price_usd: 13500,
  currency: 'KRW',
  is_available: true,
  images: [
    {
      id: 'img-2',
      r2_key: 'placeholder/img-2',
      variants: {
        thumbnail: 'https://example.com/thumb2.jpg',
        medium: 'https://example.com/medium2.jpg',
        large: 'https://example.com/large2.jpg',
        blur: 'data:image/png;base64,abc',
      },
      alt_ko: '주얼리 이미지',
      alt_en: 'Jewelry image',
      sort_order: 0,
    },
  ],
};

const soldOutProduct: Product = {
  ...saleProduct,
  id: 'shop-5',
  is_available: false,
};

describe('ProductCard', () => {
  it('renders the Korean product title when locale is "ko"', () => {
    render(<ProductCard product={artProduct} locale="ko" />);
    expect(screen.getByText('달빛 반지')).toBeInTheDocument();
  });

  it('renders the English product title when locale is "en"', () => {
    render(<ProductCard product={artProduct} locale="en" />);
    expect(screen.getByText('Moonlight Ring')).toBeInTheDocument();
  });

  it('shows formatted price for a sale product', () => {
    render(<ProductCard product={saleProduct} locale="ko" />);
    expect(screen.getByText('180,000원')).toBeInTheDocument();
  });

  it('does not show price for an art product with null price', () => {
    render(<ProductCard product={artProduct} locale="ko" />);
    expect(screen.queryByText(/원/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });

  it('shows sold out label in Korean when locale is "ko" and product is unavailable', () => {
    render(<ProductCard product={soldOutProduct} locale="ko" />);
    expect(screen.getByText('— 품절')).toBeInTheDocument();
  });

  it('shows sold out label in English when locale is "en" and product is unavailable', () => {
    render(<ProductCard product={soldOutProduct} locale="en" />);
    expect(screen.getByText('— sold out')).toBeInTheDocument();
  });

  it('does not show sold out label for an available product', () => {
    render(<ProductCard product={saleProduct} locale="ko" />);
    expect(screen.queryByText('— 품절')).not.toBeInTheDocument();
  });

  it('links to /art/:id for art category products', () => {
    render(<ProductCard product={artProduct} locale="ko" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/art/art-1');
  });

  it('links to /shop/:id for sale category products', () => {
    render(<ProductCard product={saleProduct} locale="ko" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/shop/shop-1');
  });
});
