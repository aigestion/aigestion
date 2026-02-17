import { z } from 'zod';

export const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .default('5000')
    .transform(val => parseInt(val, 10)),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  MONGODB_URI: z.string().url().or(z.string().regex(/^mongodb(\+srv)?:\/\/.+/)),
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  JWT_SECRET: z.string().min(32),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;
