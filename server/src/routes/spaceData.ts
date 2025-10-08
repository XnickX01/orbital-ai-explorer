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

// GET /api/space-data/missions
router.get('/missions', (req, res) => {
  const missions = [
    {
      id: 1,
      name: 'Artemis III',
      status: 'active',
      progress: 75,
      crew: 4,
      launchDate: '2025-12-01',
      description: 'First crewed lunar landing since Apollo',
      agency: 'NASA',
    },
    {
      id: 2,
      name: 'Mars Sample Return',
      status: 'scheduled',
      progress: 45,
      crew: 0,
      launchDate: '2026-08-15',
      description: 'Retrieve samples collected by Perseverance rover',
      agency: 'NASA/ESA',
    },
    {
      id: 3,
      name: 'Europa Clipper Extended',
      status: 'active',
      progress: 90,
      crew: 0,
      launchDate: '2024-10-14',
      description: 'Study Jupiter\'s moon Europa for signs of life',
      agency: 'NASA',
    },
    {
      id: 4,
      name: 'Lunar Gateway Assembly',
      status: 'scheduled',
      progress: 20,
      crew: 0,
      launchDate: '2027-03-10',
      description: 'Establish permanent lunar space station',
      agency: 'NASA/ESA',
    },
    {
      id: 5,
      name: 'Starship Mars Mission',
      status: 'scheduled',
      progress: 30,
      crew: 12,
      launchDate: '2028-06-15',
      description: 'First crewed mission to Mars using Starship',
      agency: 'SpaceX',
    },
  ];

  res.json(missions);
});

export default router;
