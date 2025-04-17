/**
 * Custom API Error class
 */
export class ApiError extends Error {
  statusCode: number;
  code?: string;
  errors?: Record<string, any>;

  constructor(message: string, statusCode = 500, code?: string, errors?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, 404, code);
    this.name = 'NotFoundError';
  }
}

/**
 * Bad Request Error (400)
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST', errors?: Record<string, any>) {
    super(message, 400, code, errors);
    this.name = 'BadRequestError';
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, 401, code);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(message, 403, code);
    this.name = 'ForbiddenError';
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends ApiError {
  constructor(message = 'Conflict', code = 'CONFLICT') {
    super(message, 409, code);
    this.name = 'ConflictError';
  }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error', code = 'SERVER_ERROR') {
    super(message, 500, code);
    this.name = 'InternalServerError';
  }
}

export default {
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError
}; 