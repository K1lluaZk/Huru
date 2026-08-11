import api from './api';
import type { ApiResponse, Product } from '../types';

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  page?: number;
  limit?: number;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
  isActive?: boolean;
}

export const productService = {
  list: (filters: ProductFilters = {}) =>
    api.get<ApiResponse<Product[]>>('/products', { params: filters }),

  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`),

  create: (payload: ProductPayload) => api.post<ApiResponse<Product>>('/products', payload),

  update: (id: number, payload: Partial<ProductPayload>) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, payload),

  remove: (id: number) => api.delete<ApiResponse<null>>(`/products/${id}`),
};
