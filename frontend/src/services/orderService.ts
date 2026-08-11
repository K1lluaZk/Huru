import api from './api';
import type { ApiResponse, Order, OrderStatus } from '../types';

export const orderService = {
  create: (shippingAddress: string) =>
    api.post<ApiResponse<Order>>('/orders', { shippingAddress }),

  getMyOrders: () => api.get<ApiResponse<Order[]>>('/orders'),

  getMyOrderById: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),

  // Admin
  getAllOrders: (status?: OrderStatus) =>
    api.get<ApiResponse<Order[]>>('/admin/orders', { params: status ? { status } : {} }),

  updateStatus: (id: number, status: OrderStatus) =>
    api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status }),
};
