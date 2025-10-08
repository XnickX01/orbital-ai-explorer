import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { spacexService, nasaService } from '../services/externalAPIs';

const router = Router();

// Sync data from external APIs
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Starting data synchronization...');
    
    // Sync SpaceX launches
    const spacexLaunches = await spacexService.getLaunches();
    console.log(`📡 Fetched ${spacexLaunches.length} SpaceX launches`);
    
    // Insert or update launches
    for (const launch of spacexLaunches) {
      await pool.query(
        `INSERT INTO launches (id, name, date, rocket, success, details, launchpad, crew)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         date = EXCLUDED.date,
         rocket = EXCLUDED.rocket,
         success = EXCLUDED.success,
         details = EXCLUDED.details,
         launchpad = EXCLUDED.launchpad,
         crew = EXCLUDED.crew`,
        [
          launch.id,
          launch.name,
          launch.date_utc,
          launch.rocket,
          launch.success !== null ? launch.success : false,
          launch.details,
          launch.launchpad,
          JSON.stringify(launch.crew || [])
        ]
      );
    }
    
    // Sync SpaceX rockets
    const spacexRockets = await spacexService.getRockets();
    console.log(`🚀 Fetched ${spacexRockets.length} SpaceX rockets`);
    
    // Insert or update rockets
    for (const rocket of spacexRockets) {
      await pool.query(
        `INSERT INTO rockets (id, name, type, active, stages, boosters, cost_per_launch, 
         success_rate_pct, first_flight, country, company, height, diameter, mass, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         type = EXCLUDED.type,
         active = EXCLUDED.active,
         stages = EXCLUDED.stages,
         boosters = EXCLUDED.boosters,
         cost_per_launch = EXCLUDED.cost_per_launch,
         success_rate_pct = EXCLUDED.success_rate_pct,
         first_flight = EXCLUDED.first_flight,
         country = EXCLUDED.country,
         company = EXCLUDED.company,
         height = EXCLUDED.height,
         diameter = EXCLUDED.diameter,
         mass = EXCLUDED.mass,
         description = EXCLUDED.description`,
        [
          rocket.id,
          rocket.name,
          rocket.type,
          rocket.active,
          rocket.stages,
          rocket.boosters,
          rocket.cost_per_launch,
          rocket.success_rate_pct || 0,
          rocket.first_flight,
          rocket.country,
          rocket.company,
          rocket.height?.meters || 0,
          rocket.diameter?.meters || 0,
          rocket.mass?.kg || 0,
          rocket.description
        ]
      );
    }
    
    console.log('✅ Data synchronization completed');
    
    res.json({
      success: true,
      message: 'Data synchronized successfully',
      stats: {
        launches: spacexLaunches.length,
        rockets: spacexRockets.length
      }
    });
  } catch (error) {
    console.error('❌ Error syncing data:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

export default router;
