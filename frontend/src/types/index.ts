// Space Data Types
export interface Launch {
  id: string;
  name: string;
  date: string;
  rocket: string;
  success: boolean;
  details?: string;
  launchpad?: string;
  crew?: string[];
}

export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  height: number;
  diameter: number;
  mass: number;
  description?: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  spacecraft?: string;
  objectives?: string[];
}

export interface SearchQuery {
  query: string;
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    rocketType?: string;
    successOnly?: boolean;
  };
}

export interface SearchResult {
  launches: Launch[];
  rockets: Rocket[];
  missions: Mission[];
  totalResults: number;
}

export interface DashboardStats {
  totalLaunches: number;
  successfulLaunches: number;
  activeRockets: number;
  upcomingMissions: number;
  successRate: number;
}
