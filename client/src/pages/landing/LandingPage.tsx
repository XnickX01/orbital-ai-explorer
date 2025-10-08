import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExploreIcon from '@mui/icons-material/Explore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h1" component="h1" gutterBottom color="primary">
            AI Space Data Explorer
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            Discover the universe through data-driven AI insights. Explore NASA missions, 
            SpaceX launches, and cosmic discoveries with intelligent analysis and visualization.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ mr: 2 }}
              onClick={() => navigate('/dashboard')}
            >
              Explore Data
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Powered by AI, Driven by Curiosity
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <RocketLaunchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Mission Analytics
                </Typography>
                <Typography color="text.secondary">
                  Analyze NASA and SpaceX missions with AI-powered insights, 
                  success predictions, and trend analysis.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <ExploreIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Data Visualization
                </Typography>
                <Typography color="text.secondary">
                  Interactive charts and visualizations that bring space data to life 
                  with beautiful, intuitive interfaces.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Smart Recommendations
                </Typography>
                <Typography color="text.secondary">
                  Get personalized recommendations for missions, datasets, and discoveries 
                  based on your interests and exploration history.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
