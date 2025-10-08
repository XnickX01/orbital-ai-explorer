import api from './api';
import { User, ApiResponse } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async register(userData: { name: string; email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
    localStorage.removeItem('authToken');
  },
};

export default authService;
