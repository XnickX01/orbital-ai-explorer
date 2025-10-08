import { Router } from 'express';

const router = Router();

// GET /api/users/profile
router.get('/profile', (req, res) => {
  res.status(501).json({
    message: 'Get user profile endpoint - Coming soon!',
    endpoint: 'GET /api/users/profile',
  });
});

// PUT /api/users/profile
router.put('/profile', (req, res) => {
  res.status(501).json({
    message: 'Update user profile endpoint - Coming soon!',
    endpoint: 'PUT /api/users/profile',
  });
});

// GET /api/users/favorites
router.get('/favorites', (req, res) => {
  res.status(501).json({
    message: 'Get user favorites endpoint - Coming soon!',
    endpoint: 'GET /api/users/favorites',
  });
});

// POST /api/users/favorites
router.post('/favorites', (req, res) => {
  res.status(501).json({
    message: 'Add to favorites endpoint - Coming soon!',
    endpoint: 'POST /api/users/favorites',
  });
});

export default router;
