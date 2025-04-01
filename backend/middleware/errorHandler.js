const { AppError } = require("../utils/AppError");
const { ValidationError, DatabaseError } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle Sequelize validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle Sequelize database errors
  if (err instanceof DatabaseError) {
    return res.status(500).json({
      status: "error",
      code: "DATABASE_ERROR",
      message: "Database operation failed",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      code: "AUTHENTICATION_ERROR",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      code: "AUTHENTICATION_ERROR",
      message: "Token expired",
    });
  }

  // Handle rate limit errors
  if (err.name === "RateLimitError") {
    return res.status(429).json({
      status: "error",
      code: "RATE_LIMIT_ERROR",
      message: "Too many requests, please try again later",
    });
  }

  // Handle Stripe errors
  if (err.type === "StripeError") {
    return res.status(400).json({
      status: "error",
      code: "PAYMENT_ERROR",
      message: err.message,
    });
  }

  // Default error
  return res.status(500).json({
    status: "error",
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;
