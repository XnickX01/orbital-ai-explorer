export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  interests: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredTopics: string[];
  notifications: boolean;
}

export interface SpaceData {
  id: string;
  title: string;
  description: string;
  type: 'mission' | 'discovery' | 'image' | 'dataset';
  source: 'nasa' | 'spacex' | 'esa' | 'other';
  date: string;
  data: Record<string, any>;
  tags: string[];
}

export interface Mission {
  id: string;
  name: string;
  agency: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  launchDate: string;
  description: string;
  objectives: string[];
  type: string;
}

export interface Launch {
  id: string;
  name: string;
  date: string;
  rocket: string;
  success: boolean;
  details?: string;
  links: {
    patch?: string;
    webcast?: string;
    article?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface AIAnalysis {
  summary: string;
  insights: string[];
  confidence: number;
  recommendations: string[];
  metadata: Record<string, any>;
}
