'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import {
  createOrder,
  createStripeIntent,
  createTossPayment,
  type CreateOrderPayload,
} from '@/lib/api';
import type { Product } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';

const StripePayment = dynamic(
  () => import('./StripePayment').then((module) => module.StripePayment),
  { ssr: false }
);

const TossPayment = dynamic(
  () => import('./TossPayment').then((module) => module.TossPayment),
  { ssr: false }
);

interface CheckoutFormProps {
  product: Product;
  locale: string;
}

type PaymentMethod = 'stripe' | 'toss';

interface TossParams {
  orderId: string;
  orderName: string;
  amount: number;
  successUrl: string;
  failUrl: string;
}

export function CheckoutForm({ product, locale }: CheckoutFormProps) {
  const t = useTranslations('checkout');
  const router = useRouter();

  const defaultMethod: PaymentMethod = locale === 'ko' ? 'toss' : 'stripe';
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(defaultMethod);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [zipcode, setZipcode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stripe state
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeOrderId, setStripeOrderId] = useState<string | null>(null);

  // Toss state
  const [tossParams, setTossParams] = useState<TossParams | null>(null);

  const title = locale === 'en' ? product.title_en : product.title_ko;
  const price = product.price ?? 0;
  const currency = product.currency;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CreateOrderPayload = {
        email,
        shipping_address: {
          name,
          phone,
          address,
          detail_address: detailAddress,
          zipcode,
        },
        items: [{ product_id: product.id, quantity: 1 }],
        currency: currency === 'KRW' ? 'KRW' : 'USD',
        lang: locale,
      };

      const order = await createOrder(payload);

      if (paymentMethod === 'stripe') {
        const { client_secret } = await createStripeIntent(order.id);
        setStripeClientSecret(client_secret);
        setStripeOrderId(order.id);
      } else {
        const origin = window.location.origin;
        const result = await createTossPayment(
          order.id,
          `${origin}/${locale}/order/${order.id}`,
          `${origin}/${locale}/checkout?product=${product.id}&error=payment_failed`
        );
        setTossParams({
          orderId: result.orderId,
          orderName: result.orderName,
          amount: parseInt(result.amount, 10),
          successUrl: result.successUrl,
          failUrl: result.failUrl,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = () => {
    if (stripeOrderId) {
      router.push(`/order/${stripeOrderId}`);
    }
  };

  // Show Stripe Elements after order created
  if (stripeClientSecret && stripeOrderId) {
    return (
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-light tracking-wider">{t('pay')}</h2>
        <StripePayment
          clientSecret={stripeClientSecret}
          orderId={stripeOrderId}
          locale={locale}
          onSuccess={handleStripeSuccess}
        />
      </div>
    );
  }

  // Show Toss redirect after order created
  if (tossParams) {
    return (
      <TossPayment
        tossClientKey={process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ''}
        orderId={tossParams.orderId}
        orderName={tossParams.orderName}
        amount={tossParams.amount}
        successUrl={tossParams.successUrl}
        failUrl={tossParams.failUrl}
        customerName={name}
        customerEmail={email}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Order summary */}
      <div className="border border-warm-200 p-6">
        <p className="font-body text-xs tracking-widest uppercase text-warm-400 mb-4">
          {t('orderSummary')}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-body text-sm text-ink">{title}</p>
          <p className="font-body text-sm text-ink">{formatPrice(price, currency)}</p>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="font-body text-xs tracking-widest uppercase text-warm-400">
          {t('email')}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-warm-300 bg-transparent py-2 font-body text-sm text-ink focus:outline-none focus:border-ink transition-colors"
        />
      </div>

      {/* Shipping */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="font-body text-xs tracking-widest uppercase text-warm-400">
            {t('name')}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-warm-300 bg-transparent py-2 font-body text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="font-body text-xs tracking-widest uppercase text-warm-400">
            {t('phone')}
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border-b border-warm-300 bg-transparent py-2 font-body text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="font-body text-xs tracking-widest uppercase text-warm-400">
            {t('zipcode')}
          </label>
          <input
            type="text"
            required
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            className="w-full border-b border-warm-300 bg-transparent py-2 font-body text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="font-body text-xs tracking-widest uppercase text-warm-400">
            {t('address')}
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border-b border-warm-300 bg-transparent py-2 font-body text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="font-body text-xs tracking-widest uppercase text-warm-400">
            {t('detailAddress')}
          </label>
          <input
            type="text"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="w-full border-b border-warm-300 bg-transparent py-2 font-body text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>

      {/* Payment method toggle */}
      <div className="space-y-3">
        <p className="font-body text-xs tracking-widest uppercase text-warm-400">
          {locale === 'ko' ? '결제 수단' : 'Payment Method'}
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('toss')}
            className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              paymentMethod === 'toss'
                ? 'border-ink bg-ink text-cream'
                : 'border-warm-300 text-warm-400 hover:border-ink hover:text-ink'
            }`}
          >
            {locale === 'ko' ? '토스페이' : 'Toss Pay'}
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              paymentMethod === 'stripe'
                ? 'border-ink bg-ink text-cream'
                : 'border-warm-300 text-warm-400 hover:border-ink hover:text-ink'
            }`}
          >
            {locale === 'ko' ? '카드 결제' : 'Card (Stripe)'}
          </button>
        </div>
      </div>

      {error && (
        <p className="font-body text-xs text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full font-body text-xs tracking-[0.2em] uppercase px-8 py-4 border border-ink text-ink hover:bg-ink hover:text-cream transition-colors duration-300 disabled:opacity-40"
      >
        {loading ? '...' : t('pay')}
      </button>
    </form>
  );
}
