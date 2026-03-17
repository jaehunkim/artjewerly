'use client';

import { useCartStore } from '@/store/cart';
import { Link } from '@/lib/i18n/routing';
import { formatPrice } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { PageTransition } from '@/components/ui/PageTransition';

export default function CartPage() {
  const locale = useLocale();
  const { items, removeItem, totalPrice } = useCartStore();
  const isKo = locale === 'ko';

  return (
    <PageTransition>
      <div className="px-8 md:px-16 pt-16 pb-24">
        <div className="mb-16 text-center">
          <h1 className="font-heading text-lg md:text-xl font-light tracking-[0.3em] text-ink">
            {isKo ? '장바구니' : 'Shopping Cart'}
          </h1>
          <div className="mt-3 mx-auto w-6 h-px bg-warm-300" />
        </div>

        {items.length === 0 ? (
          <div className="text-center space-y-6">
            <p className="font-body text-sm text-warm-400">
              {isKo ? '장바구니가 비어 있습니다' : 'Your cart is empty'}
            </p>
            <Link
              href="/shop"
              className="inline-block font-body text-xs tracking-[0.2em] uppercase px-8 py-4 border border-ink text-ink hover:bg-ink hover:text-cream transition-colors duration-300"
            >
              {isKo ? '쇼핑 계속하기' : 'Continue Shopping'}
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Cart items */}
            <div className="space-y-6">
              {items.map((item) => {
                const title = isKo ? item.product.title_ko : item.product.title_en;
                const thumb = item.product.images?.[0]?.variants.thumbnail;
                const price = item.product.price ?? 0;
                const detailHref =
                  item.product.category === 'art'
                    ? (`/art/${item.productId}` as const)
                    : (`/shop/${item.productId}` as const);

                return (
                  <div
                    key={item.productId}
                    className="flex gap-6 pb-6 border-b border-warm-200"
                  >
                    {thumb && (
                      <Link href={detailHref}>
                        <img
                          src={thumb}
                          alt={title}
                          className="w-24 h-30 object-cover flex-shrink-0"
                        />
                      </Link>
                    )}
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <Link href={detailHref}>
                          <p className="font-body text-xs tracking-wider text-ink hover:text-warm-500 transition-colors">
                            {title}
                          </p>
                        </Link>
                        <p className="font-body text-xs text-warm-400 mt-2">
                          {item.quantity > 1 && `${item.quantity} × `}
                          {formatPrice(price, item.product.currency)}
                        </p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="font-body text-[10px] text-warm-400 hover:text-ink transition-colors mt-3 tracking-wider"
                        >
                          {isKo ? '삭제' : 'Remove'}
                        </button>
                      </div>
                      <p className="font-body text-sm text-ink">
                        {formatPrice(price * item.quantity, item.product.currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total + checkout */}
            <div className="flex justify-between items-center pt-4">
              <span className="font-body text-xs tracking-wider text-warm-400 uppercase">
                {isKo ? '합계' : 'Total'}
              </span>
              <span className="font-body text-lg text-ink">
                {formatPrice(totalPrice(), items[0]?.product.currency ?? 'KRW')}
              </span>
            </div>

            <div className="flex gap-4">
              <Link
                href="/shop"
                className="flex-1 text-center font-body text-xs tracking-[0.2em] uppercase py-4 border border-warm-300 text-warm-500 hover:border-ink hover:text-ink transition-colors"
              >
                {isKo ? '쇼핑 계속하기' : 'Continue Shopping'}
              </Link>
              <Link
                href="/checkout"
                className="flex-1 text-center font-body text-xs tracking-[0.2em] uppercase py-4 border border-ink text-ink hover:bg-ink hover:text-cream transition-colors duration-300"
              >
                {isKo ? '주문하기' : 'Checkout'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
