import { mockShopProducts } from '@/lib/mock-data';
import { fetchProducts } from '@/lib/api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PageTransition } from '@/components/ui/PageTransition';

export const revalidate = 300;

interface ShopPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale } = await params;
  let products;
  try {
    products = await fetchProducts('sale');
  } catch {
    products = mockShopProducts;
  }

  return (
    <PageTransition>
      <div className="px-8 md:px-16 pt-16 pb-24">
        {/* Page header */}
        <div className="mb-16 text-center">
          <h1 className="font-heading text-lg md:text-xl font-light tracking-[0.3em] text-ink">
            {locale === 'en' ? 'Shop' : '판매용 주얼리'}
          </h1>
          <div className="mt-3 mx-auto w-6 h-px bg-warm-300" />
        </div>

        <ProductGrid products={products} locale={locale} />
      </div>
    </PageTransition>
  );
}
