import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from './errorHandler';

// Middleware to validate request data
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check validation results
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format error messages
    const extractedErrors = errors.array().map(err => {
      if ('path' in err && 'msg' in err) {
        return { [err.path]: err.msg };
      }
      return { error: 'Invalid value' };
    });

    // Return validation errors
    return next(new ApiError(JSON.stringify(extractedErrors), 400));
  };
}; 