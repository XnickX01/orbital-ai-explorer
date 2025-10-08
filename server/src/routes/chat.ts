import { Router } from 'express';
import axios from 'axios';

const router = Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

// POST /api/chat/ask
router.post('/ask', async (req, res) => {
  try {
    const { message, conversation_history, context } = req.body;
    
    if (!message) {
      res.status(400).json({
        error: 'Message is required',
        message: 'Please provide a message to send to the AI assistant'
      });
      return;
    }

    // Forward request to AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/chat/ask`, {
      message,
      conversation_history: conversation_history || [],
      context: context || {}
    });

    res.json({
      success: true,
      data: aiResponse.data,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat error:', error.message);
    
    // Handle AI service unavailable
    if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
      res.status(503).json({
        error: 'AI service temporarily unavailable',
        message: 'The AI assistant is currently offline. Please try again later.',
        fallback_response: {
          response: "I'm sorry, but I'm temporarily unavailable. Please try asking your question again in a few moments. In the meantime, you can explore the space data dashboard or check out the latest missions.",
          confidence: 0.5,
          suggestions: [
            "Check the missions dashboard",
            "View recent SpaceX launches", 
            "Explore NASA data"
          ]
        }
      });
      return;
    }

    res.status(500).json({
      error: 'Chat processing failed',
      message: error.response?.data?.detail || 'An error occurred while processing your message'
    });
  }
});

// POST /api/chat/query-data
router.post('/query-data', async (req, res) => {
  try {
    const { query, filters } = req.body;
    
    if (!query) {
      res.status(400).json({
        error: 'Query is required',
        message: 'Please provide a data query'
      });
      return;
    }

    // Forward request to AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/chat/query-data`, {
      query,
      filters: filters || {}
    });

    res.json({
      success: true,
      data: aiResponse.data,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Data query error:', error.message);
    
    res.status(500).json({
      error: 'Data query failed',
      message: error.response?.data?.detail || 'An error occurred while processing your data query'
    });
  }
});

// GET /api/chat/suggestions
router.get('/suggestions', async (req, res) => {
  try {
    // Forward request to AI service
    const aiResponse = await axios.get(`${AI_SERVICE_URL}/api/chat/suggestions`);

    res.json({
      success: true,
      data: aiResponse.data,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Suggestions error:', error.message);
    
    // Provide fallback suggestions
    res.json({
      success: true,
      data: {
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
      },
      fallback: true,
      message: 'Using cached suggestions (AI service unavailable)'
    });
  }
});

// GET /api/chat/health
router.get('/health', async (req, res) => {
  try {
    const aiResponse = await axios.get(`${AI_SERVICE_URL}/health/`);
    
    res.json({
      status: 'OK',
      ai_service: aiResponse.data,
      proxy_status: 'healthy',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    res.status(503).json({
      status: 'DEGRADED',
      ai_service: 'unavailable',
      proxy_status: 'healthy',
      error: 'AI service is not responding',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
