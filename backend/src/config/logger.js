import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log directory
const logDir = path.join(__dirname, '../../logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

const transports = [];

transports.push(
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info',
  })
);

// File transports (only in production)
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_FILE_LOGGING === 'true') {
  // Error logs - daily rotation
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    })
  );

  // Combined logs - daily rotation
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    })
  );

  // HTTP logs - daily rotation
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'http-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '7d',
      zippedArchive: true,
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Helper methods for structured logging
logger.logRequest = (req, message = 'Incoming request') => {
  logger.http(message, {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id || 'anonymous',
    userAgent: req.get('user-agent'),
  });
};

logger.logResponse = (req, res, message = 'Outgoing response') => {
  logger.http(message, {
    method: req.method,
    url: req.originalUrl || req.url,
    statusCode: res.statusCode,
    userId: req.user?.id || 'anonymous',
  });
};

logger.logError = (error, req = null, additionalInfo = {}) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    ...additionalInfo,
  };

  if (req) {
    errorLog.method = req.method;
    errorLog.url = req.originalUrl || req.url;
    errorLog.ip = req.ip || req.connection.remoteAddress;
    errorLog.userId = req.user?.id || 'anonymous';
    errorLog.body = req.body;
    errorLog.params = req.params;
    errorLog.query = req.query;
  }

  logger.error('Error occurred', errorLog);
};

logger.logUserActivity = (userId, action, details = {}) => {
  logger.info('User activity', {
    userId,
    action,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

logger.logDatabaseOperation = (operation, collection, details = {}) => {
  logger.debug('Database operation', {
    operation,
    collection,
    ...details,
  });
};

logger.logAuth = (action, userId, success, details = {}) => {
  logger.info('Authentication event', {
    action,
    userId,
    success,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

export default logger;

