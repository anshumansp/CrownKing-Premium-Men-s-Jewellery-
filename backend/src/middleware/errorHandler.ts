import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from './logger';
import { ValidationError } from 'express-validator';

// Extended error interface
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  errors?: ValidationError[] | Record<string, any>;
  isOperational?: boolean;
}

/**
 * Error handler middleware that processes errors and sends appropriate responses
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default to 500 if statusCode not set
  const statusCode = err.statusCode || 500;
  
  // Create response object
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Server Error',
      code: err.code || 'INTERNAL_SERVER_ERROR',
      requestId: req.id,
    },
    validation: err.errors,
  };
  
  // Log error with request details
  winstonLogger.error({
    message: `${statusCode} - ${err.message}`,
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    stack: err.stack,
    body: req.body,
    query: req.query,
    params: req.params,
  });
  
  // Only include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    // Create a copy of the response with the stack trace
    const devResponse = {
      ...errorResponse,
      error: {
        ...errorResponse.error,
        stack: err.stack
      }
    };
    return res.status(statusCode).json(devResponse);
  }
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Custom API error class with status code and operational flag
 */
export class ApiError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
  errors?: ValidationError[] | Record<string, any>;

  constructor(
    message: string, 
    statusCode: number, 
    code: string = 'API_ERROR',
    isOperational: boolean = true,
    errors?: ValidationError[] | Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.errors = errors;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  /**
   * Factory method for validation errors
   */
  static validationError(errors: ValidationError[]) {
    return new ApiError(
      'Validation Error', 
      400, 
      'VALIDATION_ERROR', 
      true, 
      errors
    );
  }
  
  /**
   * Factory method for not found errors
   */
  static notFound(resource: string = 'Resource') {
    return new ApiError(
      `${resource} not found`, 
      404, 
      'NOT_FOUND', 
      true
    );
  }
  
  /**
   * Factory method for unauthorized errors
   */
  static unauthorized(message: string = 'Unauthorized access') {
    return new ApiError(
      message, 
      401, 
      'UNAUTHORIZED', 
      true
    );
  }
  
  /**
   * Factory method for forbidden errors
   */
  static forbidden(message: string = 'Forbidden access') {
    return new ApiError(
      message, 
      403, 
      'FORBIDDEN', 
      true
    );
  }
} 