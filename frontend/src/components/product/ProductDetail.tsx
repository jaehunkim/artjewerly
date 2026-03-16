'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/routing';
import { AnimatedImage } from '@/components/ui/AnimatedImage';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/mock-data';

interface ProductDetailProps {
  product: Product;
  locale: string;
}

export function ProductDetail({ product, locale }: ProductDetailProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const title = locale === 'en' ? product.title_en : product.title_ko;
  const description =
    locale === 'en' ? product.description_en : product.description_ko;
  const backLabel = locale === 'en' ? '← Back' : '← 돌아가기';
  const backHref = product.category === 'art' ? ('/art' as const) : ('/shop' as const);
  const activeImage = product.images[activeIndex];

  return (
    <div className="min-h-screen">
      {/* Back link */}
      <div className="px-8 md:px-16 pt-10 pb-6">
        <Link
          href={backHref}
          className="font-body text-xs tracking-widest text-warm-400 hover:text-ink transition-colors uppercase"
        >
          {backLabel}
        </Link>
      </div>

      <div className="px-8 md:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image column */}
          <div>
            {/* Main image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeImage && (
                  <AnimatedImage
                    src={activeImage.variants.large}
                    srcSet={`${activeImage.variants.medium} 800w, ${activeImage.variants.large} 1600w`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    alt={locale === 'en' ? activeImage.alt_en : activeImage.alt_ko}
                    blur={activeImage.variants.blur}
                    aspectRatio="4/5"
                    priority={activeIndex === 0}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail strip — only shown when multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIndex(i)}
                    className={`relative w-16 h-20 overflow-hidden flex-shrink-0 transition-opacity duration-200 ${
                      i === activeIndex ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={img.variants.thumbnail}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pt-8"
          >
            <h1 className="font-heading text-3xl md:text-4xl font-light tracking-wider text-ink mb-6">
              {title}
            </h1>

            <p className="font-body text-sm leading-relaxed text-warm-500 mb-10 max-w-sm">
              {description}
            </p>

            {/* Price + CTA — shop items only */}
            {product.price !== null && (
              <div className="space-y-6">
                <div>
                  <p className="font-body text-xl text-ink tracking-wide">
                    {formatPrice(product.price, product.currency)}
                  </p>
                  {product.price_usd && (
                    <p className="font-body text-xs text-warm-400 mt-1 tracking-wider">
                      USD {(product.price_usd / 100).toFixed(2)}
                    </p>
                  )}
                </div>

                {product.is_available ? (
                  <Link
                    href={`/checkout?product=${product.id}` as any}
                    className="inline-block font-body text-xs tracking-[0.2em] uppercase px-8 py-4 border border-ink text-ink hover:bg-ink hover:text-cream transition-colors duration-300"
                  >
                    {locale === 'en' ? 'Buy Now' : '구매하기'}
                  </Link>
                ) : (
                  <p className="font-body text-xs tracking-widest uppercase text-warm-300">
                    {locale === 'en' ? 'Sold Out' : '품절'}
                  </p>
                )}
              </div>
            )}

            {/* Art piece — no price, no buy */}
            {product.price === null && (
              <p className="font-body text-xs tracking-widest uppercase text-warm-400">
                {locale === 'en' ? 'Art Piece — Not for Sale' : '아트 피스 — 판매 제품 아님'}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
