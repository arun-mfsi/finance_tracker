// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/database.js';
import apiRoutes from './src/routes/index.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';
import logger from './src/config/logger.js';
import { httpLogger, errorLogger } from './src/middleware/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());

// HTTP request logging
app.use(httpLogger);

// Body parsing middleware - conditionally apply based on content-type
app.use((req, res, next) => {
  const contentType = req.get('content-type') || '';

  // Skip body parsing for multipart/form-data (file uploads)
  if (contentType.includes('multipart/form-data')) {
    return next();
  }

  // Apply JSON parser
  express.json({ limit: '10mb' })(req, res, (err) => {
    if (err) return next(err);

    // Apply URL-encoded parser
    express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Finance Tracker API',
    version: '1.0.0',
    status: 'running',
  });
});

// API routes with rate limiter
app.use('/api', apiLimiter, apiRoutes);

// Error logging middleware
app.use(errorLogger);

// Error handling middleware
app.use((err, req, res, _next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl || req.url,
    userId: req.user?.id || 'anonymous',
    ip: req.ip || req.connection.remoteAddress,
  });

  res.status(err.status || 500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Log level: ${process.env.LOG_LEVEL || 'info'}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();
