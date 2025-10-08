import { Router } from 'express';

const router = Router();

// GET /api/space-data/nasa/apod
router.get('/nasa/apod', (req, res) => {
  res.status(501).json({
    message: 'NASA Astronomy Picture of the Day endpoint - Coming soon!',
    endpoint: 'GET /api/space-data/nasa/apod',
  });
});

// GET /api/space-data/spacex/launches
router.get('/spacex/launches', (req, res) => {
  res.status(501).json({
    message: 'SpaceX launches endpoint - Coming soon!',
    endpoint: 'GET /api/space-data/spacex/launches',
  });
});

// GET /api/space-data/spacex/rockets
router.get('/spacex/rockets', (req, res) => {
  res.status(501).json({
    message: 'SpaceX rockets endpoint - Coming soon!',
    endpoint: 'GET /api/space-data/spacex/rockets',
  });
});

// GET /api/space-data/nasa/missions
router.get('/nasa/missions', (req, res) => {
  res.status(501).json({
    message: 'NASA missions endpoint - Coming soon!',
    endpoint: 'GET /api/space-data/nasa/missions',
  });
});

export default router;
