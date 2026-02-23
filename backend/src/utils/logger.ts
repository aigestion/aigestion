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

export interface ILogger {
  info: (msg: string | object, ...args: any[]) => void;
  error: (msg: string | object, ...args: any[]) => void;
  warn: (msg: string | object, ...args: any[]) => void;
  debug: (msg: string | object, ...args: any[]) => void;
  verbose?: (msg: string | object, ...args: any[]) => void;
  silly?: (msg: string | object, ...args: any[]) => void;
  [key: string]: any;
}

// Helper to support both (msg, meta) and (meta, msg) signatures
// Compatible with Winston legacy usage
function wrap(
  method: 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'fatal',
): (msg: string | object, ...args: any[]) => void {
  return (...args: any[]) => {
    const [arg1, arg2, ...rest] = args;
    const loggerInstance = pinoLogger as any;
    // Determine which argument is the message and which is the object
    if (typeof arg1 === 'string') {
      if (arg2 && typeof arg2 === 'object') {
        // (msg, meta) -> Pino (meta, msg)
        loggerInstance[method](arg2, arg1, ...rest);
      } else {
        // (msg)
        loggerInstance[method](arg1, arg2, ...rest);
      }
    } else if (typeof arg1 === 'object' && typeof arg2 === 'string') {
      // (meta, msg) -> Pino (meta, msg)
      loggerInstance[method](arg1, arg2, ...rest);
    } else {
      // Fallback
      loggerInstance[method](arg1, arg2, ...rest);
    }
  };
}

const internalLogger: ILogger = {
  info: wrap('info'),
  error: wrap('error'),
  warn: wrap('warn'),
  debug: wrap('debug'),
};

// Helper to ensure all methods exist and are bound correctly
const wrapLogger = (pinoInstance: any): ILogger => {
  const methods = ['info', 'error', 'warn', 'debug'];
  const safeLogger: any = { ...pinoInstance };

  methods.forEach(method => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const original = pinoInstance[method];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    safeLogger[method] =
      typeof original === 'function'
        ? original.bind(pinoInstance)
        : // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          (...args: any[]) => pinoInstance.info(...args);
  });

  return safeLogger as ILogger;
};

export const logger: ILogger = wrapLogger(pinoLogger);
export default internalLogger;
