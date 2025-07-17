import winston from "winston";
import config from "@/config/config";

// Create custom format that combines timestamp, errors, and JSON
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, service, module, ...meta }) => {
    const serviceLabel = module ? `${service}-${module}` : service;
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `[${timestamp}] [${serviceLabel}] ${level}: ${message} ${metaStr}`;
  })
);

// Get service name dynamically from package.json or environment
const getServiceName = () => {
  return process.env.SERVICE_NAME || 
         process.env.npm_package_name || 
         'app';
};

export const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { 
    service: getServiceName()
  },
  transports: [
    // Error logs
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Add console transport for non-production environments
if (config.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}