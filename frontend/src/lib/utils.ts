export function formatPrice(amount: number, currency: string): string {
  if (currency === 'USD') {
    return `$${(amount / 100).toFixed(2)}`;
  }
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  locale: string,
  field: string
): string {
  const key = `${field}_${locale}` as keyof T;
  const fallback = `${field}_ko` as keyof T;
  return (obj[key] ?? obj[fallback] ?? '') as string;
}
