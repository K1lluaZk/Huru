import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import type { Cart } from '../types';

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const emptyCart: Cart = { items: [], total: 0, itemCount: 0 };

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user || user.role !== 'CLIENT') {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await cartService.get();
      setCart(res.data.data);
    } catch {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity = 1) => {
    await cartService.add(productId, quantity);
    await refreshCart();
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    await cartService.updateQuantity(itemId, quantity);
    await refreshCart();
  };

  const removeItem = async (itemId: number) => {
    await cartService.remove(itemId);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartService.clear();
    await refreshCart();
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, refreshCart, addToCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de un CartProvider');
  return ctx;
}
