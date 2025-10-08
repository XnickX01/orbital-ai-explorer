import axios from 'axios';
import { Launch, Rocket, Mission, SearchQuery, SearchResult, DashboardStats } from '../types';

const expressAPI = axios.create({
  baseURL: '/api/express',
  headers: {
    'Content-Type': 'application/json',
  },
});

const aiAPI = axios.create({
  baseURL: '/api/ai',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Express Backend API calls
export const dataService = {
  // Get all launches
  getLaunches: async (): Promise<Launch[]> => {
    const response = await expressAPI.get('/launches');
    return response.data;
  },

  // Get launch by ID
  getLaunchById: async (id: string): Promise<Launch> => {
    const response = await expressAPI.get(`/launches/${id}`);
    return response.data;
  },

  // Get all rockets
  getRockets: async (): Promise<Rocket[]> => {
    const response = await expressAPI.get('/rockets');
    return response.data;
  },

  // Get rocket by ID
  getRocketById: async (id: string): Promise<Rocket> => {
    const response = await expressAPI.get(`/rockets/${id}`);
    return response.data;
  },

  // Get all missions
  getMissions: async (): Promise<Mission[]> => {
    const response = await expressAPI.get('/missions');
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await expressAPI.get('/stats');
    return response.data;
  },

  // Sync data from external APIs (NASA, SpaceX, FAA)
  syncExternalData: async () => {
    const response = await expressAPI.post('/sync');
    return response.data;
  },
};

// FastAPI AI-powered search
export const aiService = {
  // Natural language search
  search: async (query: SearchQuery): Promise<SearchResult> => {
    const response = await aiAPI.post('/search', query);
    return response.data;
  },

  // Get AI-powered insights
  getInsights: async (dataType: string, id: string) => {
    const response = await aiAPI.get(`/insights/${dataType}/${id}`);
    return response.data;
  },

  // Vector similarity search
  findSimilar: async (dataType: string, id: string) => {
    const response = await aiAPI.get(`/similar/${dataType}/${id}`);
    return response.data;
  },
};
