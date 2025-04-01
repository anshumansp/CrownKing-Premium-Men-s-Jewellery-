class AppError extends Error {
  constructor(
    message,
    statusCode,
    code = "INTERNAL_SERVER_ERROR",
    details = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
const ErrorTypes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
};

module.exports = {
  AppError,
  ErrorTypes,
};
