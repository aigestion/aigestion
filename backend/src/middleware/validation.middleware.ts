/**
 * Validation Middleware Module
 *
 * Provides a flexible validation utility based on Zod schemas for request
 * bodies, query strings, and URL parameters. Errors are forwarded to the
 * global `errorHandler` middleware.
 */
import type { NextFunction, Request, Response } from 'express';
import { z, type AnyZodObject } from 'zod';

export interface ValidationSchema {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Enhanced validation middleware that supports validating body, query, and params.
 * Throws ZodError to be caught by the global errorHandler.
 */
/**
 * Create a validation middleware for Express routes.
 *
 * The `schema` argument can contain Zod objects for `body`, `query`, and
 * `params`. Each part is validated asynchronously; on success the parsed
 * value replaces the original request property. Validation errors are passed
 * to `next` so the global error handler can convert them to a proper HTTP
 * response (e.g., 400 Bad Request).
 */
export const validate = (schema: ValidationSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as any;
      }
      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as any;
      }
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

/**
 * Legacy wrappers for backward compatibility if needed, or specific use cases.
 */
/** Legacy wrappers for backward compatibility */
export const validateBody = (schema: AnyZodObject) => validate({ body: schema });
export const validateQuery = (schema: AnyZodObject) => validate({ query: schema });
export const validateParams = (schema: AnyZodObject) => validate({ params: schema });

/**
 * Common Zod schemas used across the application.
 * Includes generic ID validation, authentication payloads, user creation /
 * update schemas, AI prompts, and pagination helpers.
 */
// Estandarización de esquemas comunes
export const schemas = {
  common: {
    id: z.object({
      id: z.string().regex(/^(?:\d+|[0-9a-fA-F]{24})$/, 'Invalid ID format'),
    }),
  },
  auth: {
    register: z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(12)
        .regex(
          /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
          'Password must include number and special character',
        ),
      name: z.string().min(2),
    }),
    login: z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(12)
        .regex(
          /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
          'Password must include number and special character',
        ),
    }),
    enable2FA: z.object({
      userId: z.string(), // Allow Mongo ID or UUID
    }),
    verify2FA: z.object({
      userId: z.string(),
      token: z.string().min(6), // Allow longer for backup codes
    }),
  },
  user: {
    create: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z
        .string()
        .min(12)
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Password must include number and special character')
        .optional(),
    }),
    update: z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      password: z
        .string()
        .min(12)
        .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, 'Password must include number and special character')
        .optional(),
    }),
  },
  ai: {
    prompt: z.object({
      prompt: z.string().min(1),
    }),
    chat: z.object({
      prompt: z.string().min(1),
      history: z
        .array(
          z.object({
            role: z.enum(['user', 'assistant', 'system']),
            content: z.string().min(1),
          }),
        )
        .optional(),
    }),
    sessionId: z.string().optional(),
    userId: z.string().optional(),
    text: z.string().optional(),
    audio: z.string().optional(),
  },
  pagination: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
};

export type RegisterDto = z.infer<typeof schemas.auth.register>;
export type LoginDto = z.infer<typeof schemas.auth.login>;
export type CreateUserDto = z.infer<typeof schemas.user.create>;
export type UpdateUserDto = z.infer<typeof schemas.user.update>;
export type AIPromptDto = z.infer<typeof schemas.ai.prompt>;
export type AIChatDto = z.infer<typeof schemas.ai.chat>;
