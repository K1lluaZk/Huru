import api from './api';
import type { ApiResponse, Cart, CartItem } from '../types';

export const cartService = {
  get: () => api.get<ApiResponse<Cart>>('/cart'),

  add: (productId: number, quantity = 1) =>
    api.post<ApiResponse<CartItem>>('/cart', { productId, quantity }),

  updateQuantity: (itemId: number, quantity: number) =>
    api.put<ApiResponse<CartItem>>(`/cart/${itemId}`, { quantity }),

  remove: (itemId: number) => api.delete<ApiResponse<null>>(`/cart/${itemId}`),

  clear: () => api.delete<ApiResponse<null>>('/cart'),
};
