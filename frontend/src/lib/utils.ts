export function formatPrice(amount: number, currency: string): string {
  if (currency === 'USD') {
    return `$${(amount / 100).toFixed(2)}`;
  }
  return `${amount.toLocaleString('ko-KR')}원`;
}
