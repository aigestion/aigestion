import { z } from 'zod';

/**
 * Security Configuration Schema
 * Defines all security-related configuration with validation
 */
export const securityConfigSchema = z.object({
  // Rate limiting configuration
  rateLimiting: z.object({
    windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
    maxRequests: z.object({
      free: z.number().default(1000000),
      pro: z.number().default(1000000),
      enterprise: z.number().default(1000000),
    }),
    authEndpoints: z.object({
      windowMs: z.number().default(15 * 60 * 1000),
      max: z.number().default(1000000),
    }),
    aiEndpoints: z.object({
      windowMs: z.number().default(60 * 1000), // 1 minute
      max: z.number().default(1000000),
    }),
    uploadEndpoints: z.object({
      windowMs: z.number().default(60 * 60 * 1000), // 1 hour
      max: z.number().default(1000000),
    }),
  }),

  // Content Security Policy
  csp: z.object({
    reportOnly: z.boolean().default(false),
    directives: z.object({
      defaultSrc: z.array(z.string()).default(["'self'"]),
      scriptSrc: z.array(z.string()).default(["'self'", "'unsafe-eval'"]),
      styleSrc: z.array(z.string()).default(["'self'", "'unsafe-inline'", 'fonts.googleapis.com']),
      imgSrc: z.array(z.string()).default(["'self'", 'data:', 'https:', 'blob:']),
      connectSrc: z
        .array(z.string())
        .default([
          "'self'",
          'ws:',
          'wss:',
          'api.openai.com',
          'api.anthropic.com',
          'googleapis.com',
          'vertexai.googleapis.com',
          'pinecone.io',
        ]),
      fontSrc: z.array(z.string()).default(["'self'", 'fonts.gstatic.com', 'data:']),
      objectSrc: z.array(z.string()).default(["'none'"]),
      mediaSrc: z.array(z.string()).default(["'self'"]),
      frameSrc: z.array(z.string()).default(["'none'"]),
      childSrc: z.array(z.string()).default(["'none'"]),
      workerSrc: z.array(z.string()).default(["'self'", 'blob:']),
      manifestSrc: z.array(z.string()).default(["'self'"]),
      upgradeInsecureRequests: z.array(z.string()).default([]),
    }),
  }),

  // Security headers
  headers: z.object({
    hsts: z.object({
      maxAge: z.number().default(31536000),
      includeSubDomains: z.boolean().default(true),
      preload: z.boolean().default(true),
    }),
    frameguard: z.object({
      action: z.enum(['deny', 'sameorigin']).default('deny'),
    }),
    referrerPolicy: z
      .enum([
        'no-referrer',
        'no-referrer-when-downgrade',
        'origin',
        'origin-when-cross-origin',
        'same-origin',
        'strict-origin',
        'strict-origin-when-cross-origin',
        'unsafe-url',
      ])
      .default('no-referrer'),
  }),

  // API security
  api: z.object({
    requireApiKey: z.boolean().default(true),
    apiKeyFormat: z.string().default('nexus_[a-f0-9]{32}'),
    jwt: z.object({
      expiresIn: z.string().default('24h'),
      algorithm: z.array(z.string()).default(['HS256']),
      issuer: z.string().default('nexus-v1'),
      audience: z.string().default('nexus-users'),
    }),
  }),

  // File upload security
  fileUpload: z.object({
    maxFileSize: z.string().default('10mb'),
    allowedMimeTypes: z
      .array(z.string())
      .default([
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/json',
      ]),
    maxFiles: z.number().default(5),
    scanForMalware: z.boolean().default(true),
  }),

  // IP security
  ipSecurity: z.object({
    enableBlocking: z.boolean().default(true),
    blockedIPs: z.array(z.string()).default([]),
    rateLimitByIP: z.boolean().default(true),
    enableGeoblocking: z.boolean().default(false),
    allowedCountries: z.array(z.string()).default([]),
    blockedCountries: z.array(z.string()).default([]),
  }),

  // Monitoring and logging
  monitoring: z.object({
    logSecurityEvents: z.boolean().default(true),
    logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('warn'),
    enableMetrics: z.boolean().default(true),
    alertThresholds: z.object({
      failedAuthAttempts: z.number().default(10),
      suspiciousRequests: z.number().default(50),
      slowRequests: z.number().default(100),
    }),
  }),

  // Encryption
  encryption: z.object({
    algorithm: z.string().default('aes-256-gcm'),
    keyRotationInterval: z.number().default(30 * 24 * 60 * 60 * 1000), // 30 days
    enableFieldLevelEncryption: z.boolean().default(false),
    encryptedFields: z.array(z.string()).default([]),
  }),

  // Session security
  session: z.object({
    maxAge: z.number().default(24 * 60 * 60 * 1000), // 24 hours
    secure: z.boolean().default(true),
    httpOnly: z.boolean().default(true),
    sameSite: z.enum(['strict', 'lax', 'none']).default('strict'),
    rolling: z.boolean().default(true),
  }),
});

/**
 * Default security configuration
 */
export const defaultSecurityConfig = {
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: {
      free: 1000000,
      pro: 1000000,
      enterprise: 1000000,
    },
    authEndpoints: {
      windowMs: 15 * 60 * 1000,
      max: 1000000,
    },
    aiEndpoints: {
      windowMs: 60 * 1000, // 1 minute
      max: 1000000,
    },
    uploadEndpoints: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 1000000,
    },
  },

  csp: {
    reportOnly: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: [
        "'self'",
        'ws:',
        'wss:',
        'api.openai.com',
        'api.anthropic.com',
        'googleapis.com',
        'vertexai.googleapis.com',
        'pinecone.io',
      ],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      childSrc: ["'none'"],
      workerSrc: ["'self'", 'blob:'],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },

  headers: {
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny' as const,
    },
    referrerPolicy: 'no-referrer' as const,
  },

  api: {
    requireApiKey: true,
    apiKeyFormat: /^nexus_[a-f0-9]{32}$/,
    jwt: {
      expiresIn: '24h',
      algorithm: ['HS256'],
      issuer: 'nexus-v1',
      audience: 'nexus-users',
    },
  },

  fileUpload: {
    maxFileSize: '10mb',
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/json',
    ],
    maxFiles: 5,
    scanForMalware: true,
  },

  ipSecurity: {
    enableBlocking: true,
    blockedIPs: [],
    rateLimitByIP: true,
    enableGeoblocking: false,
    allowedCountries: [],
    blockedCountries: [],
  },

  monitoring: {
    logSecurityEvents: true,
    logLevel: 'warn' as const,
    enableMetrics: true,
    alertThresholds: {
      failedAuthAttempts: 10,
      suspiciousRequests: 50,
      slowRequests: 100,
    },
  },

  encryption: {
    algorithm: 'aes-256-gcm',
    keyRotationInterval: 30 * 24 * 60 * 60 * 1000, // 30 days
    enableFieldLevelEncryption: false,
    encryptedFields: [],
  },

  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: true,
    httpOnly: true,
    sameSite: 'strict' as const,
    rolling: true,
  },
};

/**
 * Validate security configuration
 */
export const validateSecurityConfig = (config: unknown) => {
  return securityConfigSchema.parse(config);
};

/**
 * Get security configuration from environment variables
 */
export const getSecurityConfig = () => {
  const config = {
    rateLimiting: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
      maxRequests: {
        free: parseInt(process.env.RATE_LIMIT_FREE_MAX || '100'),
        pro: parseInt(process.env.RATE_LIMIT_PRO_MAX || '1000'),
        enterprise: parseInt(process.env.RATE_LIMIT_ENTERPRISE_MAX || '10000'),
      },
      authEndpoints: {
        windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000'),
        max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
      },
      aiEndpoints: {
        windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS || '60000'),
        max: parseInt(process.env.AI_RATE_LIMIT_MAX || '10'),
      },
      uploadEndpoints: {
        windowMs: parseInt(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS || '3600000'),
        max: parseInt(process.env.UPLOAD_RATE_LIMIT_MAX || '10'),
      },
    },

    csp: {
      reportOnly: process.env.CSP_REPORT_ONLY === 'true',
      directives: defaultSecurityConfig.csp.directives,
    },

    headers: defaultSecurityConfig.headers,

    api: {
      requireApiKey: process.env.REQUIRE_API_KEY !== 'false',
      apiKeyFormat: defaultSecurityConfig.api.apiKeyFormat,
      jwt: defaultSecurityConfig.api.jwt,
    },

    fileUpload: {
      maxFileSize: process.env.MAX_FILE_SIZE || '10mb',
      allowedMimeTypes: defaultSecurityConfig.fileUpload.allowedMimeTypes,
      maxFiles: parseInt(process.env.MAX_FILES || '5'),
      scanForMalware: process.env.SCAN_UPLOADS_FOR_MALWARE !== 'false',
    },

    ipSecurity: {
      enableBlocking: process.env.ENABLE_IP_BLOCKING !== 'false',
      blockedIPs: process.env.BLOCKED_IPS?.split(',') || [],
      rateLimitByIP: process.env.RATE_LIMIT_BY_IP !== 'false',
      enableGeoblocking: process.env.ENABLE_GEOBLOCKING === 'true',
      allowedCountries: process.env.ALLOWED_COUNTRIES?.split(',') || [],
      blockedCountries: process.env.BLOCKED_COUNTRIES?.split(',') || [],
    },

    monitoring: {
      logSecurityEvents: process.env.LOG_SECURITY_EVENTS !== 'false',
      logLevel: (process.env.SECURITY_LOG_LEVEL as any) || 'warn',
      enableMetrics: process.env.ENABLE_SECURITY_METRICS !== 'false',
      alertThresholds: defaultSecurityConfig.monitoring.alertThresholds,
    },

    encryption: defaultSecurityConfig.encryption,

    session: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'),
      secure: process.env.NODE_ENV === 'production',
      httpOnly: process.env.SESSION_HTTP_ONLY !== 'false',
      sameSite: (process.env.SESSION_SAME_SITE as any) || 'strict',
      rolling: process.env.SESSION_ROLLING !== 'false',
    },
  };

  return validateSecurityConfig(config);
};
