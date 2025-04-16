import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configure Winston logger
export const winstonLogger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
      });
    })
  ),
  defaultMeta: { service: 'crown-king-api' },
  transports: [
    // Write logs with level 'error' and below to 'error.log'
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs to 'combined.log'
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5, 
    }),
  ],
});

// Add console transport in development
if (env.NODE_ENV === 'development') {
  winstonLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Generate a unique request ID
const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Create stream object for Morgan to write to Winston
const morganStream = {
  write: (message: string) => {
    // Remove newline character from Morgan log
    winstonLogger.info(message.trim());
  },
};

// Set up Morgan middleware
export const httpLogger = morgan(
  // Define log format
  ':requestId :method :url :status :response-time ms - :res[content-length]',
  {
    stream: morganStream,
  }
);

// Assign a unique ID to each request
morgan.token('requestId', (req: Request) => {
  const id = req.get('X-Request-Id') || generateRequestId();
  // Attach to request object for use in error handler and application
  req.id = id as string;
  return id as string;
});

// Middleware that combines Morgan HTTP logging and request tracking
export const logger = (req: Request, res: Response, next: NextFunction) => {
  // Add request ID to response headers
  res.setHeader('X-Request-Id', req.id || generateRequestId());
  
  // Continue with middleware chain
  next();
};

// Extend Express Request interface to include id property
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
} 