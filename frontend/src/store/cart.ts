'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/mock-data';

// NOTE: Cart stores full Product snapshots in localStorage for offline display.
// Prices may become stale if updated in the admin panel after the user added items.
// This is acceptable because the backend recalculates prices from the DB when
// creating an order (see backend/internal/repository/order.go#fetchProductPrices),
// so the actual charged amount is always correct.
export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { productId: product.id, quantity: 1, product }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0),
    }),
    {
      name: 'heeang-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
