import api from './api';
import type { ApiResponse, DashboardStats } from '../types';

export const adminService = {
  getDashboard: () => api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),
};
