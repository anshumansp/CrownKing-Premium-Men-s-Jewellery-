import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';
// Use require for express-sanitizer to avoid TypeScript errors
const expressSanitizer = require('express-sanitizer');
import { winstonLogger } from './logger';
import { ApiError } from './errorHandler';
import { env } from '../config/env';

/**
 * Configure helmet middleware with CSP and other security headers
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow loading of third-party resources
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Allow new windows
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin resource sharing
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 15552000, // 180 days
    includeSubDomains: true,
    preload: true,
  },
});

/**
 * Rate limiter options based on environment
 */
const rateLimiterOptions = {
  // For production, use stricter limits
  production: {
    points: 100, // Number of points
    duration: 60, // Per 60 seconds
  },
  // For development, use more relaxed limits
  development: {
    points: 500,
    duration: 60,
  },
};

// Choose appropriate rate limiter options based on environment
const options = env.NODE_ENV === 'production' 
  ? rateLimiterOptions.production
  : rateLimiterOptions.development;

// Create rate limiter instance
const rateLimiter = new RateLimiterMemory(options);

/**
 * Rate limiting middleware
 */
export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use IP as identifier, with fallback to a default
    const identifier = req.ip || '127.0.0.1';
    
    // Consume points
    await rateLimiter.consume(identifier);
    next();
  } catch (error) {
    // Log rate limit exceeded
    winstonLogger.warn({
      message: 'Rate limit exceeded',
      ip: req.ip,
      path: req.path,
      method: req.method,
      requestId: req.id,
    });
    
    // Return 429 Too Many Requests
    const apiError = new ApiError(
      'Too many requests, please try again later.',
      429,
      'RATE_LIMIT_EXCEEDED', 
      true
    );
    
    next(apiError);
  }
};

/**
 * Santitize middleware to prevent XSS
 */
export const sanitizeMiddleware = expressSanitizer();

/**
 * Combined security middleware that applies all security measures
 */
export const securityMiddleware = [
  helmetMiddleware,
  rateLimiterMiddleware,
  sanitizeMiddleware,
];

/**
 * Set security headers manually if needed
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Set additional security headers not covered by helmet
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Permissions Policy (formerly Feature-Policy)
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), camera=(), microphone=(), payment=(self "https://js.stripe.com")'
  );
  
  next();
}; 