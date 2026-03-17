'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { Link } from '@/lib/i18n/routing';
import { formatPrice } from '@/lib/utils';
import { useLocale } from 'next-intl';

export function CartDrawer() {
  const locale = useLocale();
  const { items, isDrawerOpen, closeDrawer, removeItem, totalPrice } = useCartStore();
  const isKo = locale === 'ko';

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEsc);
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-ink/20 z-50 transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[340px] max-w-[85vw] bg-cream z-50 border-l border-warm-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-warm-200">
          <h2 className="font-heading text-sm font-light tracking-[0.2em]">
            {isKo ? '장바구니' : 'Cart'}
          </h2>
          <button
            onClick={closeDrawer}
            className="text-warm-400 hover:text-ink transition-colors"
            aria-label="Close cart"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="1" y1="1" x2="15" y2="15" />
              <line x1="15" y1="1" x2="1" y2="15" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <p className="font-body text-xs text-warm-400 tracking-wider">
              {isKo ? '장바구니가 비어 있습니다' : 'Your cart is empty'}
            </p>
          ) : (
            items.map((item) => {
              const title = isKo ? item.product.title_ko : item.product.title_en;
              const thumb = item.product.images[0]?.variants.thumbnail;
              const price = item.product.price ?? 0;
              return (
                <div key={item.productId} className="flex gap-4">
                  {thumb && (
                    <img
                      src={thumb}
                      alt={title}
                      className="w-16 h-20 object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs tracking-wider text-ink truncate">
                      {title}
                    </p>
                    <p className="font-body text-xs text-warm-400 mt-1">
                      {item.quantity > 1 && `${item.quantity} × `}
                      {formatPrice(price, item.product.currency)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="font-body text-[10px] text-warm-400 hover:text-ink transition-colors mt-2 tracking-wider"
                    >
                      {isKo ? '삭제' : 'Remove'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-warm-200 space-y-4">
            <div className="flex justify-between">
              <span className="font-body text-xs tracking-wider text-warm-400">
                {isKo ? '합계' : 'Total'}
              </span>
              <span className="font-body text-sm text-ink">
                {formatPrice(totalPrice(), items[0]?.product.currency ?? 'KRW')}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block text-center font-body text-xs tracking-[0.2em] uppercase py-3 border border-warm-300 text-warm-500 hover:border-ink hover:text-ink transition-colors"
            >
              {isKo ? '장바구니 보기' : 'View Cart'}
            </Link>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block text-center font-body text-xs tracking-[0.2em] uppercase py-3 border border-ink text-ink hover:bg-ink hover:text-cream transition-colors duration-300"
            >
              {isKo ? '주문하기' : 'Checkout'}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
