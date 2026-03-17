import { Link } from '@/lib/i18n/routing';
import { AnimatedImage } from '@/components/ui/AnimatedImage';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/mock-data';

interface ProductCardProps {
  product: Product;
  locale: string;
  index?: number;
}

export function ProductCard({ product, locale, index = 0 }: ProductCardProps) {
  const title = locale === 'en' ? product.title_en : product.title_ko;
  const primaryImage = product.images?.[0];
  const detailHref =
    product.category === 'art'
      ? (`/art/${product.id}` as const)
      : (`/shop/${product.id}` as const);

  return (
    <div
      className="heeang-enter"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link href={detailHref} className="group block">
        <div className="max-w-[80%] mx-auto">
          <div className="overflow-hidden">
            {primaryImage ? (
              <AnimatedImage
                src={primaryImage.variants.medium}
                srcSet={`${primaryImage.variants.thumbnail} 400w, ${primaryImage.variants.medium} 800w`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={locale === 'en' ? primaryImage.alt_en : primaryImage.alt_ko}
                blur={primaryImage.variants.blur}
                aspectRatio="4/5"
                className="transition-transform duration-300 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <div
                className="w-full bg-warm-100 transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                style={{ aspectRatio: '4/5' }}
              />
            )}
          </div>

          <div className="mt-4 space-y-1">
          <p className="font-body text-xs tracking-widest uppercase text-ink group-hover:text-warm-500 transition-colors duration-200">
            {title}
          </p>
          {product.price !== null && (
            <p className="font-body text-xs text-warm-400 tracking-wider">
              {formatPrice(product.price, product.currency)}
              {!product.is_available && (
                <span className="ml-2 text-warm-300">
                  {locale === 'en' ? '— sold out' : '— 품절'}
                </span>
              )}
            </p>
          )}
          </div>
        </div>
      </Link>
    </div>
  );
}
