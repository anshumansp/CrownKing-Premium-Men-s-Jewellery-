import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { UnauthorizedError, ForbiddenError, InternalServerError } from '../utils/errors';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Extract JWT token from request headers
 */
const extractToken = (req: Request): string | null => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

/**
 * Verify JWT token and return decoded data
 */
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.auth.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };
  } catch (error) {
    return null;
  }
};

/**
 * Required authentication middleware
 * Will throw 401 if no token or invalid token
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    // Check if token exists
    if (!token) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }

    // Add user from payload to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return next(new UnauthorizedError('Authentication failed'));
  }
};

/**
 * Optional authentication middleware
 * Will continue if no token or invalid token, but will set user if valid
 */
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded = verifyToken(token);
      
      if (decoded) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Role-based authorization middleware
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new InternalServerError('User not found in request'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(`User role ${req.user.role} is not authorized to access this route`)
      );
    }
    
    next();
  };
}; 