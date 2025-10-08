import React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Paper,
  useTheme,
  alpha,
  Avatar,
  Stack,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  RocketLaunch as RocketIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Psychology as AiIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [healthStatus, setHealthStatus] = useState<string>('Checking...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkServices = async () => {
      try {
        // Check Express server health
        const serverResponse = await api.get('/health');
        
        // Check AI service health
        const aiResponse = await fetch('http://localhost:8001/health/');
        const aiData = await aiResponse.json();
        
        if (serverResponse.status === 200 && aiResponse.ok) {
          setHealthStatus('All Services Online');
        } else {
          setHealthStatus('Service Issues Detected');
        }
      } catch (error) {
        console.error('Health check failed:', error);
        setHealthStatus('Service Connection Error');
      } finally {
        setIsLoading(false);
      }
    };

    checkServices();
    const interval = setInterval(checkServices, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const quickStats = [
    {
      title: 'Active Missions',
      value: '12',
      change: '+2',
      icon: <RocketIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Data Analyzed',
      value: '847GB',
      change: '+15%',
      icon: <AnalyticsIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'AI Insights',
      value: '234',
      change: '+8',
      icon: <AiIcon />,
      color: theme.palette.success.main,
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      change: '+0.3%',
      icon: <StarIcon />,
      color: theme.palette.warning.main,
    },
  ];

  const recentActivities = [
    {
      title: 'Mars Rover Analysis Complete',
      description: 'Completed analysis of Perseverance mission data',
      time: '2 hours ago',
      type: 'analysis',
    },
    {
      title: 'New Mission Scheduled',
      description: 'Europa Clipper mission added to tracking',
      time: '4 hours ago',
      type: 'mission',
    },
    {
      title: 'AI Model Updated',
      description: 'Trajectory prediction model v2.1 deployed',
      time: '6 hours ago',
      type: 'ai',
    },
    {
      title: 'Data Sync Complete',
      description: 'Latest NASA datasets synchronized',
      time: '8 hours ago',
      type: 'data',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mission Control
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                icon={<SpeedIcon />}
                label={healthStatus}
                color={healthStatus === 'All Services Online' ? 'success' : 'error'}
                variant="outlined"
              />
              <IconButton 
                onClick={() => window.location.reload()}
                sx={{
                  background: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4
          }}>
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card sx={{
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  '&:hover': {
                    border: `1px solid ${alpha(stat.color, 0.4)}`,
                  },
                  transition: 'all 0.3s ease-in-out',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar sx={{ 
                        background: alpha(stat.color, 0.2),
                        color: stat.color,
                        width: 48,
                        height: 48
                      }}>
                        {stat.icon}
                      </Avatar>
                      <Chip 
                        label={stat.change}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card sx={{
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Recent Activities
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.title}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <Paper sx={{
                      p: 2,
                      background: alpha(theme.palette.background.default, 0.3),
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.05),
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {activity.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default Dashboard;
