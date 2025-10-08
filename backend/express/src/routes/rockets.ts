import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Get all rockets
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rockets ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching rockets:', error);
    res.status(500).json({ error: 'Failed to fetch rockets' });
  }
});

// Get rocket by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM rockets WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rocket not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching rocket:', error);
    res.status(500).json({ error: 'Failed to fetch rocket' });
  }
});

// Get active rockets
router.get('/filter/active', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rockets WHERE active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching active rockets:', error);
    res.status(500).json({ error: 'Failed to fetch active rockets' });
  }
});

export default router;
