const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const { sequelize, redisClient } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const { AppError, ErrorTypes } = require("./utils/AppError");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payments");
require("dotenv").config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      sandbox: ["allow-forms", "allow-scripts", "allow-same-origin"],
    },
  })
);

// Rate Limiting
const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of points
  duration: 1, // Per second
  blockDuration: 60 * 15, // Block for 15 minutes if limit exceeded
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (error) {
    next(new AppError("Too many requests", 429, ErrorTypes.RATE_LIMIT_ERROR));
  }
});

// CORS Configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://your-production-domain.com"
      : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.use(
  express.json({
    limit: "10kb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Redis Cache Middleware (Optional)
const cacheMiddleware = (duration) => async (req, res, next) => {
  if (req.method !== "GET" || !redisClient.isReady) {
    return next();
  }

  const key = `cache:${req.originalUrl}`;
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    res.sendResponse = res.json;
    res.json = (body) => {
      redisClient.setEx(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    // If Redis fails, just continue without caching
    next();
  }
};

// Routes with optional caching
app.use(
  "/api/products",
  process.env.USE_REDIS ? cacheMiddleware(300) : [],
  productRoutes
);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new AppError("Route not found", 404, ErrorTypes.NOT_FOUND_ERROR));
});

// Error handling middleware
app.use(errorHandler);

// Unhandled rejection handler
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // Gracefully shutdown the server
  process.exit(1);
});

// Uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Gracefully shutdown the server
  process.exit(1);
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Try to connect to Redis, but don't fail if it's not available
    try {
      if (process.env.USE_REDIS) {
        await redisClient.connect();
        console.log("Redis connection established successfully.");
      }
    } catch (error) {
      console.warn("Redis not available, continuing without caching");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
