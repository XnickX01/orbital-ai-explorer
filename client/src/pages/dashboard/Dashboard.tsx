import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Space Data Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to your AI-powered space exploration dashboard. 
        This is where you'll discover missions, analyze data, and get AI insights.
      </Typography>
      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Coming Soon:
        </Typography>
        <Typography variant="body1">
          • Interactive mission timelines<br />
          • Real-time launch tracking<br />
          • AI-generated insights<br />
          • Personalized recommendations<br />
          • Data visualization charts
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
