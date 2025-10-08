import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// Get all launches
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM launches ORDER BY date DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching launches:', error);
    res.status(500).json({ error: 'Failed to fetch launches' });
  }
});

// Get launch by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM launches WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Launch not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching launch:', error);
    res.status(500).json({ error: 'Failed to fetch launch' });
  }
});

// Get recent launches
router.get('/recent/:count', async (req: Request, res: Response) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const result = await pool.query(
      'SELECT * FROM launches ORDER BY date DESC LIMIT $1',
      [count]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recent launches:', error);
    res.status(500).json({ error: 'Failed to fetch recent launches' });
  }
});

export default router;
