import { Router } from 'express';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  res.status(501).json({
    message: 'User registration endpoint - Coming soon!',
    endpoint: 'POST /api/auth/register',
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.status(501).json({
    message: 'User login endpoint - Coming soon!',
    endpoint: 'POST /api/auth/login',
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.status(501).json({
    message: 'User logout endpoint - Coming soon!',
    endpoint: 'POST /api/auth/logout',
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.status(501).json({
    message: 'Get current user endpoint - Coming soon!',
    endpoint: 'GET /api/auth/me',
  });
});

export default router;
