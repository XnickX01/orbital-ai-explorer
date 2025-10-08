import { Box, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const TrendsPage = () => {
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
            Space Exploration Trends
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Discover emerging patterns and future predictions in space exploration.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Trends Analysis Coming Soon
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Advanced trend analysis including mission frequency patterns, 
                success rate evolution, technology advancement tracking, and 
                predictive modeling for future space exploration initiatives.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default TrendsPage;
