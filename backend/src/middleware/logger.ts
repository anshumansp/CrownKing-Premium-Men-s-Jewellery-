import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

// Simple request logger
export const logger = (req: Request, _res: Response, next: NextFunction) => {
  if (env.NODE_ENV === 'development') {
    console.log(
      `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
  }
  next();
}; 