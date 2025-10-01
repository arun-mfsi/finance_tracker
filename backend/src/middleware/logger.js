import logger from '../config/logger.js';
import morgan from 'morgan';

// Morgan HTTP request logger middleware
export const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: logger.stream,
  }
);

// Request logging middleware
export const requestLogger = (req, res, next) => {

  logger.logRequest(req, 'Incoming request');

  const originalSend = res.send;
  res.send = function (data) {
    logger.logResponse(req, res, 'Outgoing response');
    originalSend.call(this, data);
  };

  next();
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.logError(err, req, {
    errorName: err.name,
    errorCode: err.code,
  });

  next(err);
};

// User activity logging helper
export const logUserActivity = (action) => {
  return (req, res, next) => {
    const userId = req.user?.id || 'anonymous';
    const details = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
    };

    logger.logUserActivity(userId, action, details);
    next();
  };
};

export default {
  httpLogger,
  requestLogger,
  errorLogger,
  logUserActivity,
};

