import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Get all missions
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM missions ORDER BY start_date DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

// Get mission by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM missions WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching mission:', error);
    res.status(500).json({ error: 'Failed to fetch mission' });
  }
});

export default router;
