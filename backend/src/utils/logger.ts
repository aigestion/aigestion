// src/utils/logger.ts
import pino from 'pino';
import { requestContext } from './context';

// Configuration
const isDev = process.env.NODE_ENV === 'development';

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'email',
      'password',
      'token',
      'key',
      'secret',
      'authorization',
      'cookie',
      'payload.password',
      '*.token',
      '*.apiKey',
      '*.secret',
    ],
    remove: true,
  },
  hooks: {
    logMethod(inputArgs: any[], method: any) {
      if (inputArgs.length >= 2 && typeof inputArgs[1] === 'string') {
        const msg = inputArgs[1];
        // 🩺 DX God Mode: Auto-healing suggestions
        if (msg.includes('MongooseServerSelectionError') || msg.includes('buffering timed out')) {
          inputArgs[1] = `${msg} [GOD SUGGESTION]: Revisa si MongoDB está corriendo o ejecuta ./scripts/docker-reset.ps1`;
        } else if (msg.includes('Redis connection lost') || msg.includes('ECONNREFUSED')) {
          inputArgs[1] = `${msg} [GOD SUGGESTION]: Verifica el puerto 6379 o tus credenciales en el .env`;
        }
      }
      return method.apply(this, inputArgs);
    },
  },
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
  info: (msg: unknown, ...args: any[]) => void;
  error: (msg: unknown, ...args: any[]) => void;
  warn: (msg: unknown, ...args: any[]) => void;
  debug: (msg: unknown, ...args: any[]) => void;
  verbose?: (msg: unknown, ...args: any[]) => void;
  silly?: (msg: unknown, ...args: any[]) => void;
  [key: string]: any;
}

// Helper to support both (msg, meta) and (meta, msg) signatures
// Compatible with Winston legacy usage
function wrap(
  method: 'info' | 'error' | 'warn' | 'debug' | 'trace' | 'fatal',
): (msg: unknown, ...args: any[]) => void {
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
