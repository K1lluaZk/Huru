import api from './api';
import type { ApiResponse, User } from '../types';

interface AuthPayload {
  user: User;
  token: string;
}

export const authService = {
  register: (name: string, email: string, password: string) =>
    api.post<ApiResponse<AuthPayload>>('/auth/register', { name, email, password }),

  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthPayload>>('/auth/login', { email, password }),

  me: () => api.get<ApiResponse<User>>('/auth/me'),
};
