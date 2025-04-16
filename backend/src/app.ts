import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRoutes from './api';
import { errorHandler } from './middleware/errorHandler';
import { logger, httpLogger } from './middleware/logger';
import { helmetMiddleware, rateLimiterMiddleware, securityHeaders, sanitizeMiddleware } from './middleware/security';

// Initialize Express app
const app = express();

// Basic middleware
app.use(cors({ 
  origin: env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Apply security middleware
app.use(helmetMiddleware);
app.use(securityHeaders);

// Request parsing middleware
app.use(express.json({ limit: '10kb' })); // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeMiddleware);

// Logging middleware
app.use(httpLogger);
app.use(logger);

// Rate limiting middleware
app.use(rateLimiterMiddleware);

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

// 404 handler for undefined routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND'
    }
  });
});

// Error handler middleware (must be after routes)
app.use(errorHandler);

export default app; 