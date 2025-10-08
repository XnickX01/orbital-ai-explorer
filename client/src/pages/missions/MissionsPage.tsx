import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Rocket as RocketIcon,
  CheckCircle as SuccessIcon,
  Schedule as ScheduledIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const MissionsPage = () => {
  const theme = useTheme();
  const [missions, setMissions] = useState([
    {
      id: 1,
      name: 'Artemis III',
      status: 'active',
      progress: 75,
      crew: 4,
      launchDate: '2025-12-01',
      description: 'First crewed lunar landing since Apollo',
    },
    {
      id: 2,
      name: 'Mars Sample Return',
      status: 'scheduled',
      progress: 45,
      crew: 0,
      launchDate: '2026-08-15',
      description: 'Retrieve samples collected by Perseverance rover',
    },
    {
      id: 3,
      name: 'Europa Clipper Extended',
      status: 'active',
      progress: 90,
      crew: 0,
      launchDate: '2024-10-14',
      description: 'Study Jupiter\'s moon Europa for signs of life',
    },
    {
      id: 4,
      name: 'Lunar Gateway Assembly',
      status: 'scheduled',
      progress: 20,
      crew: 0,
      launchDate: '2027-03-10',
      description: 'Establish permanent lunar space station',
    },
  ]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await api.get('/api/space-data/missions');
        if (response.data) {
          setMissions(response.data);
        }
      } catch (error) {
        console.log('Using mock data - API endpoint not available');
      }
    };

    fetchMissions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'scheduled': return theme.palette.warning.main;
      case 'completed': return theme.palette.primary.main;
      default: return theme.palette.error.main;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <SuccessIcon />;
      case 'scheduled': return <ScheduledIcon />;
      case 'completed': return <SuccessIcon />;
      default: return <ErrorIcon />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ p: 3 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Space Missions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Track and monitor all active and scheduled space exploration missions.
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -4 }}
            >
                <Card 
                  sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${alpha(getStatusColor(mission.status), 0.1)} 0%, ${alpha(getStatusColor(mission.status), 0.05)} 100%)`,
                    border: `1px solid ${alpha(getStatusColor(mission.status), 0.2)}`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${getStatusColor(mission.status)} 0%, ${alpha(getStatusColor(mission.status), 0.6)} 100%)`,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          background: alpha(theme.palette.primary.main, 0.2),
                          color: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <RocketIcon />
                      </Avatar>
                      <Chip 
                        icon={getStatusIcon(mission.status)}
                        label={mission.status.toUpperCase()}
                        size="small"
                        sx={{
                          background: alpha(getStatusColor(mission.status), 0.1),
                          color: getStatusColor(mission.status),
                          fontWeight: 600,
                          '& .MuiChip-icon': {
                            color: getStatusColor(mission.status),
                          }
                        }}
                      />
                    </Box>
                    
                    <Typography variant="h6" component="div" fontWeight={700} gutterBottom>
                      {mission.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {mission.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Launch Date: {new Date(mission.launchDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress: {mission.progress}%
                      </Typography>
                      {mission.crew > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Crew: {mission.crew}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default MissionsPage;
