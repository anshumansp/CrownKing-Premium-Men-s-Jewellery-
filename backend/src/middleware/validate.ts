import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from './errorHandler';
import { winstonLogger } from './logger';

/**
 * Middleware to validate request data using express-validator
 * 
 * @param validations Array of validation chains to apply
 * @returns Middleware function
 */
export const validate = (validations: ValidationChain[]) => {
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

      // Return validation errors using the factory method
      return next(ApiError.validationError(errors.array()));
    } catch (error) {
      return next(new ApiError('Validation error', 500, 'VALIDATION_ERROR_UNEXPECTED', false));
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