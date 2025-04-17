import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { BadRequestError } from '../utils/errors';
import { winstonLogger } from './logger';

/**
 * Middleware to validate request data using express-validator
 * 
 * @param validations Array of validation chains to apply
 * @returns Middleware function
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Execute all validations
      await Promise.all(validations.map(validation => validation.run(req)));

      // Check validation results
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // Log validation errors
      winstonLogger.debug({
        message: 'Validation failed',
        requestId: req.id,
        path: req.path,
        method: req.method,
        errors: errors.array(),
        body: req.body,
      });

      // Format errors for the response
      const formattedErrors = errors.array().reduce((acc: Record<string, string>, error: any) => {
        acc[error.param] = error.msg;
        return acc;
      }, {});

      // Return validation errors
      return next(new BadRequestError('Validation failed', 'VALIDATION_ERROR', formattedErrors));
    } catch (error) {
      return next(new BadRequestError('Unexpected validation error', 'VALIDATION_ERROR_UNEXPECTED'));
    }
  };
};

/**
 * Common validation patterns
 */
export const validationPatterns = {
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  USERNAME_REGEX: /^[a-zA-Z0-9_-]{3,16}$/,
}; 