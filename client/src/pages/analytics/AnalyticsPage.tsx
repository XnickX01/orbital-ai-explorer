import { Box, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  ShowChart as ChartIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const AnalyticsPage = () => {
  const theme = useTheme();

  const analyticsCards = [
    {
      title: 'Mission Success Rate',
      value: '94.2%',
      trend: '+2.1%',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Data Processing Speed',
      value: '1.2TB/hr',
      trend: '+15%',
      icon: <ChartIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'AI Prediction Accuracy',
      value: '87.5%',
      trend: '+5.2%',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      trend: '+0.1%',
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
    },
  ];

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
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Deep insights and performance metrics for space exploration operations.
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3 
        }}>
          {analyticsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -4 }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mb: 2,
                    color: card.color,
                  }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h4" component="div" fontWeight={700} gutterBottom>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="success.main"
                    sx={{ fontWeight: 600 }}
                  >
                    {card.trend} this month
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        <Box sx={{ mt: 4 }}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Advanced Analytics Coming Soon
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Interactive charts, predictive models, and real-time space data visualization 
                  will be available in the next release. Stay tuned for comprehensive analytics 
                  powered by our AI service.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AnalyticsPage;
