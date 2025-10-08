import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Link
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Lightbulb as SuggestionIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import chatService, { ChatMessage, ChatResponse, ChatSuggestions } from '../../services/chat';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ChatSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serviceStatus, setServiceStatus] = useState<'healthy' | 'degraded' | 'unknown'>('unknown');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSuggestions();
    checkServiceHealth();
    
    // Welcome message
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: "👋 Hello! I'm your AI assistant specializing in space industry knowledge. I can help you learn about space missions, rocket technology, satellite operations, and industry trends. What would you like to explore today?",
      timestamp: new Date().toISOString(),
      message_id: 'welcome_msg'
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = async () => {
    try {
      const suggestionsData = await chatService.getSuggestions();
      setSuggestions(suggestionsData);
    } catch (error) {
      console.warn('Failed to load suggestions:', error);
    }
  };

  const checkServiceHealth = async () => {
    try {
      const health = await chatService.getHealthStatus();
      setServiceStatus(health.status === 'OK' ? 'healthy' : 'degraded');
    } catch (error) {
      setServiceStatus('degraded');
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || currentMessage.trim();
    if (!text) return;

    setError(null);
    setIsLoading(true);
    
    // Add user message to conversation
    const userMessage = chatService.formatMessage('user', text);
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentMessage('');

    try {
      // Send message to AI service
      const response: ChatResponse = await chatService.sendMessage(
        text,
        updatedMessages,
        { page: 'chat', timestamp: new Date().toISOString() }
      );

      // Add AI response to conversation
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        message_id: response.message_id
      };

      setMessages([...updatedMessages, aiMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      setError('Failed to send message. Please try again.');
      
      // Add error message to conversation
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. You can also explore the space data dashboard while I recover.",
        timestamp: new Date().toISOString(),
        message_id: `error_${Date.now()}`
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BotIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" component="h1">
                  AI Space Assistant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your expert guide to space exploration and technology
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={serviceStatus === 'healthy' ? 'Online' : serviceStatus === 'degraded' ? 'Limited' : 'Checking...'}
                color={serviceStatus === 'healthy' ? 'success' : serviceStatus === 'degraded' ? 'warning' : 'default'}
                size="small"
              />
              <Tooltip title="Refresh">
                <IconButton onClick={checkServiceHealth} size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Messages Area */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {messages.map((message, index) => (
            <Box
              key={message.message_id || index}
              sx={{
                display: 'flex',
                mb: 2,
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '80%',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                    width: 32,
                    height: 32
                  }}
                >
                  {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
                </Avatar>
                
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
                    color: message.role === 'user' ? 'primary.contrastText' : 'text.primary'
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {message.timestamp && new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                    
                    {message.role === 'assistant' && (
                      <Tooltip title="Copy message">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(message.content)}
                          sx={{ opacity: 0.7 }}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <BotIcon />
              </Avatar>
              <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">AI is thinking...</Typography>
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Suggestions */}
        {suggestions && messages.length <= 1 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SuggestionIcon fontSize="small" />
              Try asking about:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestions.suggestions.slice(0, 4).map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  variant="outlined"
                  size="small"
                  clickable
                  onClick={() => handleSendMessage(suggestion)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={3}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about space missions, rockets, or industry trends..."
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !currentMessage.trim()}
              sx={{ minWidth: 56, height: 40 }}
            >
              <SendIcon />
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            I specialize in space industry knowledge including NASA, SpaceX, missions, and technology.
          </Typography>
        </Box>
      </Paper>

      {/* Sidebar with categories */}
      {suggestions && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Explore Topics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {Object.entries(suggestions.categories).map(([category, items]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                  {category}:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {items.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      variant="outlined"
                      clickable
                      onClick={() => handleSendMessage(`Tell me about ${item}`)}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ChatPage;
