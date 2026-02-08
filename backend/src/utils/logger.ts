// src/utils/logger.ts
import pino from 'pino';
import { requestContext } from './context';

// Configuration
const isDev = process.env.NODE_ENV === 'development';

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // In production, log JSON to stdout (best for Cloud Run/K8s).
  // In dev, use pino-pretty for readability.
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  mixin() {
    const store = requestContext.getStore?.();
    return store ? { requestId: store.get('requestId') } : {};
  },
});

// Helper to support both (msg, meta) and (meta, msg) signatures
// Compatible with Winston legacy usage
function wrap(method: 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'fatal') {
  return (arg1: any, arg2?: any, ...rest: any[]) => {
    // Determine which argument is the message and which is the object
    if (typeof arg1 === 'string') {
      if (arg2 && typeof arg2 === 'object') {
        // (msg, meta) -> Pino (meta, msg)
        pinoLogger[method](arg2, arg1, ...rest);
      } else {
        // (msg)
        pinoLogger[method](arg1, arg2, ...rest);
      }
    } else if (typeof arg1 === 'object' && typeof arg2 === 'string') {
      // (meta, msg) -> Pino (meta, msg)
      pinoLogger[method](arg1, arg2, ...rest);
    } else {
      // Fallback
      pinoLogger[method](arg1, arg2, ...rest);
    }
  };
}

export const logger = {
  info: wrap('info'),
  error: wrap('error'),
  warn: wrap('warn'),
  debug: wrap('debug'),
  verbose: wrap('trace'), // Map verbose to trace
  silly: wrap('trace'), // Map silly to trace
};

export default logger;
