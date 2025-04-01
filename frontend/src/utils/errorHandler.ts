export interface ApiError {
  status: 'error';
  code: string;
  message: string;
  details?: any;
}

export class AppError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export const isApiError = (error: any): error is ApiError => {
  return (
    error &&
    error.status === 'error' &&
    typeof error.code === 'string' &&
    typeof error.message === 'string'
  );
};

export const handleApiError = (error: any): AppError => {
  if (isApiError(error)) {
    return new AppError(error.message, error.code, error.details);
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('An unexpected error occurred');
};

export const getErrorMessage = (error: AppError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return formatValidationError(error.details);
    case 'AUTHENTICATION_ERROR':
      return 'Please log in to continue';
    case 'AUTHORIZATION_ERROR':
      return 'You do not have permission to perform this action';
    case 'NOT_FOUND_ERROR':
      return 'The requested resource was not found';
    case 'CONFLICT_ERROR':
      return 'This operation cannot be completed due to a conflict';
    case 'RATE_LIMIT_ERROR':
      return 'Too many requests. Please try again later';
    case 'PAYMENT_ERROR':
      return `Payment failed: ${error.message}`;
    case 'DATABASE_ERROR':
      return 'Database operation failed';
    case 'NETWORK_ERROR':
      return 'Network error. Please check your connection';
    default:
      return error.message || 'An unexpected error occurred';
  }
};

const formatValidationError = (details: any[]): string => {
  if (!Array.isArray(details)) return 'Validation failed';
  return details
    .map(error => `${error.field}: ${error.message}`)
    .join(', ');
};

export const logError = (error: Error | AppError, context?: any) => {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      name: error.name,
      message: error.message,
      code: 'code' in error ? error.code : undefined,
      details: 'details' in error ? error.details : undefined,
      context,
      stack: error.stack
    });
    return;
  }

  // In production, send to error tracking service
  // Example with a hypothetical error tracking service:
  // errorTrackingService.captureError(error, { context });
}; 