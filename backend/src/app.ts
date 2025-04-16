import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRoutes from './api';
import { errorHandler } from './middleware/errorHandler';
import { logger, httpLogger } from './middleware/logger';
import { helmetMiddleware, rateLimiterMiddleware, securityHeaders, sanitizeMiddleware } from './middleware/security';
import passport from './config/passport';
import session from 'express-session';
// Skip Redis for now to avoid type errors
// import RedisStore from 'connect-redis';
// import { createClient } from 'redis';

// Initialize Express app
const app = express();

// Initialize Redis client for session store - commented out to avoid type errors
// const redisClient = createClient({
//   url: env.REDIS_URL
// });
// 
// redisClient.connect().catch(console.error);
// 
// // Redis store for express-session
// const redisStore = new RedisStore({
//   client: redisClient,
//   prefix: 'crownking:sess:',
// });

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

// Session middleware (needed for OAuth)
app.use(
  session({
    // store: redisStore, // Commented out to avoid type errors
    secret: env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

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