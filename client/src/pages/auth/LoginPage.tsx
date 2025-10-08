import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Link,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual login logic
      console.log('Login attempt:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to continue your space exploration journey
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link 
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
