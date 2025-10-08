import api from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  message_id?: string;
}

export interface ChatResponse {
  response: string;
  message_id: string;
  timestamp: string;
  confidence: number;
  sources?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  suggestions?: string[];
}

export interface ChatSuggestions {
  suggestions: string[];
  categories: {
    missions: string[];
    companies: string[];
    technologies: string[];
    topics: string[];
  };
}

export const chatService = {
  // Send a message to the AI chat bot
  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[] = [],
    context?: Record<string, any>
  ): Promise<ChatResponse> {
    try {
      const response = await api.post('/api/chat/ask', {
        message,
        conversation_history: conversationHistory,
        context: context || {}
      });

      return response.data.data;
    } catch (error: any) {
      // Handle service unavailable with fallback
      if (error.response?.status === 503) {
        return error.response.data.fallback_response;
      }
      throw error;
    }
  },

  // Query space data using natural language
  async queryData(
    query: string,
    filters?: Record<string, any>
  ): Promise<ChatResponse> {
    try {
      const response = await api.post('/api/chat/query-data', {
        query,
        filters: filters || {}
      });

      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get suggested questions for the chat
  async getSuggestions(): Promise<ChatSuggestions> {
    try {
      const response = await api.get('/api/chat/suggestions');
      return response.data.data;
    } catch (error: any) {
      // Return default suggestions if service is unavailable
      return {
        suggestions: [
          "What are the upcoming SpaceX launches?",
          "Tell me about the Artemis program",
          "How does Falcon Heavy compare to Falcon 9?",
          "What are the latest Mars mission discoveries?",
          "Show me commercial space launches from 2023"
        ],
        categories: {
          missions: ["Artemis", "Mars Sample Return", "Europa Clipper"],
          companies: ["SpaceX", "Boeing", "Blue Origin"],
          technologies: ["Falcon Heavy", "Starship", "SLS"],
          topics: ["Mars exploration", "Moon missions", "Space tourism"]
        }
      };
    }
  },

  // Check chat service health
  async getHealthStatus(): Promise<any> {
    try {
      const response = await api.get('/api/chat/health');
      return response.data;
    } catch (error: any) {
      return {
        status: 'ERROR',
        ai_service: 'unavailable',
        proxy_status: 'unknown',
        error: 'Unable to connect to chat service'
      };
    }
  },

  // Format message for conversation history
  formatMessage(role: 'user' | 'assistant', content: string): ChatMessage {
    return {
      role,
      content,
      timestamp: new Date().toISOString(),
      message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
};

export default chatService;
