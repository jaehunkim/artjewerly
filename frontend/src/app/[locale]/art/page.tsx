import { mockArtProducts } from '@/lib/mock-data';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PageTransition } from '@/components/ui/PageTransition';

export const revalidate = 300;

interface ArtPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ArtPage({ params }: ArtPageProps) {
  const { locale } = await params;

  return (
    <PageTransition>
      <div className="px-8 md:px-16 pt-16 pb-24">
        {/* Page header */}
        <div className="mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-light tracking-wider text-ink">
            {locale === 'en' ? 'Art Jewelry' : '아트 주얼리'}
          </h1>
          <div className="mt-4 w-8 h-px bg-warm-300" />
        </div>

        <ProductGrid products={mockArtProducts} locale={locale} />
      </div>
    </PageTransition>
  );
}
