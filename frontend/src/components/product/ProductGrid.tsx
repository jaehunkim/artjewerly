import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/lib/mock-data';

interface ProductGridProps {
  products: Product[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          index={i}
        />
      ))}
    </div>
  );
}
