'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useTranslations } from 'next-intl';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeFormProps {
  orderId: string;
  locale: string;
  onSuccess: () => void;
}

function StripeForm({ orderId, locale, onSuccess }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations('checkout');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/order/${orderId}`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <p className="font-body text-xs text-red-500">{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full font-body text-xs tracking-[0.2em] uppercase px-8 py-4 border border-ink text-ink hover:bg-ink hover:text-cream transition-colors duration-300 disabled:opacity-40"
      >
        {processing ? '...' : t('pay')}
      </button>
    </form>
  );
}

interface StripePaymentProps {
  clientSecret: string;
  orderId: string;
  locale: string;
  onSuccess: () => void;
}

export function StripePayment({ clientSecret, orderId, locale, onSuccess }: StripePaymentProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: 'stripe' } }}
    >
      <StripeForm orderId={orderId} locale={locale} onSuccess={onSuccess} />
    </Elements>
  );
}
