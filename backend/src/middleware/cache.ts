import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import config from '../config';
import { winstonLogger as logger } from './logger';

// Create Redis client
const redisClient = config.redis.enabled 
  ? new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password
    })
  : null;

// Connect to Redis if enabled
if (redisClient) {
  redisClient.on('connect', () => {
    logger.info('Redis client connected');
  });
  
  redisClient.on('error', (err: Error) => {
    logger.error(`Redis error: ${err}`);
  });
}

/**
 * Cache middleware
 * @param ttl Time to live in seconds
 */
export const cacheMiddleware = (ttl: number) => async (req: Request, res: Response, next: NextFunction) => {
  if (!config.redis.enabled || !redisClient) {
    return next();
  }
  
  try {
    // Skip cache for authenticated requests to ensure user-specific data is always fresh
    if (req.user) {
      return next();
    }
    
    // Create a unique key based on the route and query parameters
    const cacheKey = `cache:${req.originalUrl}`;
    
    // Try to get cached response
    const cachedResponse = await redisClient.get(cacheKey);
    
    if (cachedResponse) {
      // Return cached response
      return res.json(JSON.parse(cachedResponse));
    }
    
    // Cache miss, capture the response
    const originalSend = res.json;
    
    // @ts-ignore - override the json method
    res.json = function(body: any) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redisClient?.setex(cacheKey, ttl, JSON.stringify(body));
      }
      return originalSend.call(this, body);
    };
    
    next();
  } catch (error) {
    logger.error('Cache middleware error:', error);
    next();
  }
};

/**
 * Clear cache for a specific route
 * @param route Route pattern to clear (e.g., '/api/products')
 */
export const clearCache = async (route: string): Promise<void> => {
  if (!config.redis.enabled || !redisClient) {
    return;
  }
  
  try {
    const keys = await redisClient.keys(`cache:${route}*`);
    
    if (keys.length > 0) {
      await redisClient.del(...keys);
      logger.info(`Cleared ${keys.length} cache entries for route: ${route}`);
    }
  } catch (error) {
    logger.error('Error clearing cache:', error);
  }
};

export default {
  cacheMiddleware,
  clearCache
}; 