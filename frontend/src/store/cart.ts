'use client';

import { create } from 'zustand';
import type { Product } from '@/lib/mock-data';

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
  hydrate: () => void;
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem('heeang-cart', JSON.stringify(items));
  } catch {}
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem('heeang-cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isDrawerOpen: false,

  hydrate: () => {
    set({ items: loadFromStorage() });
  },

  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id);
      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...state.items, { productId: product.id, quantity: 1, product }];
      }
      saveToStorage(newItems);
      return { items: newItems };
    });
  },

  removeItem: (productId: string) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.productId !== productId);
      saveToStorage(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    saveToStorage([]);
    set({ items: [] });
  },

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () =>
    get().items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0),
}));
