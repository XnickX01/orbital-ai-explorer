import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Get dashboard statistics
router.get('/', async (req: Request, res: Response) => {
  try {
    // Get total launches
    const totalLaunches = await pool.query('SELECT COUNT(*) as count FROM launches');
    
    // Get successful launches
    const successfulLaunches = await pool.query(
      'SELECT COUNT(*) as count FROM launches WHERE success = true'
    );
    
    // Get active rockets
    const activeRockets = await pool.query(
      'SELECT COUNT(*) as count FROM rockets WHERE active = true'
    );
    
    // Get upcoming missions (missions with end_date in the future or null)
    const upcomingMissions = await pool.query(
      'SELECT COUNT(*) as count FROM missions WHERE end_date IS NULL OR end_date > NOW()'
    );
    
    const total = parseInt(totalLaunches.rows[0].count);
    const successful = parseInt(successfulLaunches.rows[0].count);
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    
    const stats = {
      totalLaunches: total,
      successfulLaunches: successful,
      activeRockets: parseInt(activeRockets.rows[0].count),
      upcomingMissions: parseInt(upcomingMissions.rows[0].count),
      successRate: successRate
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
