import { create } from 'zustand';
import { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: MenuItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product: MenuItem) => {
    const { items } = get();
    const existingItem = items.find(item => item.id === product.id);

    if (existingItem) {
      set({
        items: items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },

  removeItem: (productId: string) => {
    const { items } = get();
    set({
      items: items.filter(item => item.id !== productId),
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    const { items } = get();
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set({
      items: items.map(item =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
}));
