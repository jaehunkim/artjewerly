import { getTranslations } from 'next-intl/server';
import { getOrder } from '@/lib/api';
import { PageTransition } from '@/components/ui/PageTransition';
import { Link } from '@/lib/i18n/routing';
import { formatPrice } from '@/lib/utils';

interface OrderPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations('order');

  let order = null;
  try {
    order = await getOrder(id);
  } catch {
    // Order not found or API unavailable — show minimal confirmation
  }

  const shipping = order?.shipping_address ?? null;

  return (
    <PageTransition>
      <div className="min-h-screen px-8 md:px-16 py-10 max-w-lg">
        <div className="mb-12">
          <p className="font-body text-xs tracking-widest uppercase text-warm-400 mb-2">
            {t('confirmation')}
          </p>
          <h1 className="font-heading text-3xl font-light tracking-wider text-ink">
            {t('thankYou')}
          </h1>
        </div>

        {order && (
          <div className="space-y-8">
            {/* Order number */}
            <div className="border-b border-warm-200 pb-6">
              <p className="font-body text-xs tracking-widest uppercase text-warm-400 mb-1">
                {t('orderNumber')}
              </p>
              <p className="font-body text-sm text-ink font-mono">{order.id}</p>
            </div>

            {/* Payment status */}
            <div className="border-b border-warm-200 pb-6">
              <p className="font-body text-xs tracking-widest uppercase text-warm-400 mb-1">
                {t('status')}
              </p>
              <p className="font-body text-sm text-ink capitalize">{order.status}</p>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="border-b border-warm-200 pb-6 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <p className="font-body text-sm text-ink">
                      {item.product_id} × {item.quantity}
                    </p>
                    <p className="font-body text-sm text-ink">
                      {formatPrice(item.price * item.quantity, order.currency)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <p className="font-body text-xs tracking-widest uppercase text-warm-400">
                    {locale === 'ko' ? '합계' : 'Total'}
                  </p>
                  <p className="font-body text-sm text-ink">
                    {formatPrice(order.total, order.currency)}
                  </p>
                </div>
              </div>
            )}

            {/* Shipping address */}
            {shipping && (
              <div className="space-y-1">
                <p className="font-body text-xs tracking-widest uppercase text-warm-400 mb-2">
                  {locale === 'ko' ? '배송지' : 'Shipping'}
                </p>
                {shipping.name && (
                  <p className="font-body text-sm text-ink">{shipping.name}</p>
                )}
                {shipping.phone && (
                  <p className="font-body text-sm text-warm-500">{shipping.phone}</p>
                )}
                {shipping.zipcode && (
                  <p className="font-body text-sm text-warm-500">{shipping.zipcode}</p>
                )}
                {shipping.address && (
                  <p className="font-body text-sm text-warm-500">{shipping.address}</p>
                )}
                {shipping.detail_address && (
                  <p className="font-body text-sm text-warm-500">{shipping.detail_address}</p>
                )}
              </div>
            )}
          </div>
        )}

        {!order && (
          <p className="font-body text-sm text-warm-500">
            {locale === 'ko'
              ? '주문이 접수되었습니다.'
              : 'Your order has been received.'}
          </p>
        )}

        <div className="mt-12">
          <Link
            href="/shop"
            className="font-body text-xs tracking-widest uppercase text-warm-400 hover:text-ink transition-colors"
          >
            {locale === 'ko' ? '쇼핑 계속하기 →' : 'Continue Shopping →'}
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
