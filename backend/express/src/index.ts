import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import launchRoutes from './routes/launches';
import rocketRoutes from './routes/rockets';
import missionRoutes from './routes/missions';
import statsRoutes from './routes/stats';
import syncRoutes from './routes/sync';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Orbital AI Explorer - Express API',
    version: '1.0.0',
    endpoints: {
      launches: '/launches',
      rockets: '/rockets',
      missions: '/missions',
      stats: '/stats',
      sync: '/sync'
    }
  });
});

app.use('/launches', launchRoutes);
app.use('/rockets', rocketRoutes);
app.use('/missions', missionRoutes);
app.use('/stats', statsRoutes);
app.use('/sync', syncRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Express server is running at http://localhost:${port}`);
});

export default app;
