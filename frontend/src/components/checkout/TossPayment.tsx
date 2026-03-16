'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface TossPaymentProps {
  tossClientKey: string;
  orderId: string;
  orderName: string;
  amount: number;
  successUrl: string;
  failUrl: string;
  customerName: string;
  customerEmail: string;
}

export function TossPayment({
  tossClientKey,
  orderId,
  orderName,
  amount,
  successUrl,
  failUrl,
  customerName,
  customerEmail,
}: TossPaymentProps) {
  const t = useTranslations('checkout');
  const initiated = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;

    const run = async () => {
      try {
        // Dynamically import the Toss SDK to avoid SSR issues
        const { loadTossPayments } = await import('@tosspayments/tosspayments-sdk');
        const tossPayments = await loadTossPayments(tossClientKey);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (tossPayments as any).requestPayment('카드', {
          amount,
          orderId,
          orderName,
          successUrl,
          failUrl,
          customerName,
          customerEmail,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Payment failed';
        window.location.href = `${failUrl}?message=${encodeURIComponent(msg)}`;
      }
    };

    run();
  }, [tossClientKey, orderId, orderName, amount, successUrl, failUrl, customerName, customerEmail]);

  return (
    <div className="flex items-center justify-center py-12">
      <p className="font-body text-xs tracking-widest text-warm-400">
        {t('pay')}...
      </p>
    </div>
  );
}
