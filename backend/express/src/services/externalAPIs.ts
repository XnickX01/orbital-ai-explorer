import axios from 'axios';

// NASA API
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

export const nasaService = {
  // Get Mars Rover Photos
  getMarsPhotos: async (rover: string = 'curiosity', sol: number = 1000) => {
    try {
      const response = await axios.get(
        `${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`,
        {
          params: { sol, api_key: NASA_API_KEY }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching Mars photos:', error);
      throw error;
    }
  },

  // Get Astronomy Picture of the Day
  getAPOD: async () => {
    try {
      const response = await axios.get(
        `${NASA_BASE_URL}/planetary/apod`,
        {
          params: { api_key: NASA_API_KEY }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching APOD:', error);
      throw error;
    }
  },

  // Get Near Earth Objects
  getNEOs: async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get(
        `${NASA_BASE_URL}/neo/rest/v1/feed`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
            api_key: NASA_API_KEY
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching NEOs:', error);
      throw error;
    }
  }
};

// SpaceX API
const SPACEX_BASE_URL = 'https://api.spacexdata.com/v4';

export const spacexService = {
  // Get all launches
  getLaunches: async () => {
    try {
      const response = await axios.get(`${SPACEX_BASE_URL}/launches`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SpaceX launches:', error);
      throw error;
    }
  },

  // Get launch by ID
  getLaunchById: async (id: string) => {
    try {
      const response = await axios.get(`${SPACEX_BASE_URL}/launches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SpaceX launch:', error);
      throw error;
    }
  },

  // Get all rockets
  getRockets: async () => {
    try {
      const response = await axios.get(`${SPACEX_BASE_URL}/rockets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SpaceX rockets:', error);
      throw error;
    }
  },

  // Get rocket by ID
  getRocketById: async (id: string) => {
    try {
      const response = await axios.get(`${SPACEX_BASE_URL}/rockets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SpaceX rocket:', error);
      throw error;
    }
  },

  // Get upcoming launches
  getUpcomingLaunches: async () => {
    try {
      const response = await axios.get(`${SPACEX_BASE_URL}/launches/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming launches:', error);
      throw error;
    }
  },

  // Get latest launch
  getLatestLaunch: async () => {
    try {
      const response = await axios.get(`${SPACEX_BASE_URL}/launches/latest`);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest launch:', error);
      throw error;
    }
  }
};

export default {
  nasa: nasaService,
  spacex: spacexService
};
