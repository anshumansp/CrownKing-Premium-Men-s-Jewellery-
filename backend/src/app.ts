import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRoutes from './api';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Welcome to the CrownKing Express API!');
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRoutes);

// Error handler middleware (must be after routes)
app.use(errorHandler);

export default app; 