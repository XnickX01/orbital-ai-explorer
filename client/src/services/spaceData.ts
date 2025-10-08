import api from './api';
import { SpaceData, Mission, Launch, ApiResponse } from '../types';

export const spaceDataService = {
  // NASA APIs
  async getApod(date?: string): Promise<ApiResponse<any>> {
    const params = date ? { date } : {};
    const response = await api.get('/api/space-data/nasa/apod', { params });
    return response.data;
  },

  async getNasaMissions(): Promise<ApiResponse<Mission[]>> {
    const response = await api.get('/api/space-data/nasa/missions');
    return response.data;
  },

  // SpaceX APIs
  async getSpaceXLaunches(limit = 10): Promise<ApiResponse<Launch[]>> {
    const response = await api.get('/api/space-data/spacex/launches', {
      params: { limit }
    });
    return response.data;
  },

  async getSpaceXRockets(): Promise<ApiResponse<any[]>> {
    const response = await api.get('/api/space-data/spacex/rockets');
    return response.data;
  },

  // General space data
  async searchData(query: string, filters?: Record<string, any>): Promise<ApiResponse<SpaceData[]>> {
    const response = await api.get('/api/space-data/search', {
      params: { query, ...filters }
    });
    return response.data;
  },
};

export default spaceDataService;
