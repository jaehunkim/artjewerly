import { describe, it, expect } from 'vitest';
import { formatPrice } from '../utils';

describe('formatPrice', () => {
  describe('KRW formatting', () => {
    it('formats a standard KRW amount with Korean comma separator and won sign', () => {
      expect(formatPrice(180000, 'KRW')).toBe('180,000원');
    });

    it('formats a small KRW amount without comma', () => {
      expect(formatPrice(950, 'KRW')).toBe('950원');
    });

    it('formats zero KRW as 0원', () => {
      expect(formatPrice(0, 'KRW')).toBe('0원');
    });

    it('formats a negative KRW amount with minus sign', () => {
      expect(formatPrice(-5000, 'KRW')).toBe('-5,000원');
    });
  });

  describe('USD formatting', () => {
    it('converts cents to dollars and formats with dollar sign and two decimal places', () => {
      expect(formatPrice(13500, 'USD')).toBe('$135.00');
    });

    it('formats zero USD as $0.00', () => {
      expect(formatPrice(0, 'USD')).toBe('$0.00');
    });

    it('formats a negative USD amount with minus sign', () => {
      expect(formatPrice(-500, 'USD')).toBe('$-5.00');
    });

    it('formats a USD amount that results in cents', () => {
      expect(formatPrice(101, 'USD')).toBe('$1.01');
    });
  });
});
