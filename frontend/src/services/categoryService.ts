import api from './api';
import type { ApiResponse, Category } from '../types';

export const categoryService = {
  list: () => api.get<ApiResponse<Category[]>>('/categories'),
  create: (name: string) => api.post<ApiResponse<Category>>('/categories', { name }),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/categories/${id}`),
};
