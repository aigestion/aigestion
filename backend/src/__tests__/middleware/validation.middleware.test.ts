// src/__tests__/middleware/validation.middleware.test.ts
import { validate, validateBody, validateQuery, validateParams, schemas } from '../../../src/middleware/validation.middleware';
import type { Request, Response, NextFunction } from 'express';

describe('validation.middleware', () => {
    const makeReq = (overrides: Partial<Request> = {}): Request => {
        return {
            body: {},
            query: {},
            params: {},
            ...overrides,
        } as Request;
    };
    const makeRes = (): Response => ({}) as Response;
    const nextMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('validates body and attaches parsed data', async () => {
        const schema = { body: schemas.auth.register };
        const middleware = validate(schema);
        const req = makeReq({ body: { email: 'test@example.com', password: 'Passw0rd!@#12', name: 'John' } });
        await middleware(req, makeRes(), nextMock);
        expect(nextMock).toHaveBeenCalledWith();
        expect(req.body).toEqual({ email: 'test@example.com', password: 'Passw0rd!@#12', name: 'John' });
    });

    it('passes ZodError to next on invalid body', async () => {
        const schema = { body: schemas.auth.register };
        const middleware = validate(schema);
        const req = makeReq({ body: { email: 'invalid', password: 'short', name: '' } });
        await middleware(req, makeRes(), nextMock);
        expect(nextMock).toHaveBeenCalledTimes(1);
        const err = (nextMock.mock.calls[0] ?? [])[0];
        expect(err).toBeDefined();
        expect(err.name).toBe('ZodError');
    });

    it('validates query parameters', async () => {
        const schema = { query: schemas.pagination };
        const middleware = validate(schema);
        const req = makeReq({ query: { page: '2', limit: '10' } });
        await middleware(req, makeRes(), nextMock);
        expect(nextMock).toHaveBeenCalledWith();
        expect(req.query).toEqual({ page: 2, limit: 10 });
    });

    it('validates params', async () => {
        const schema = { params: schemas.common.id };
        const middleware = validate(schema);
        const req = makeReq({ params: { id: '123' } });
        await middleware(req, makeRes(), nextMock);
        expect(nextMock).toHaveBeenCalledWith();
        expect(req.params).toEqual({ id: '123' });
    });

    it('wrapper validateBody works', async () => {
        const middleware = validateBody(schemas.auth.login);
        const req = makeReq({ body: { email: 'test@example.com', password: 'Passw0rd!@#12' } });
        await middleware(req, makeRes(), nextMock);
        expect(nextMock).toHaveBeenCalledWith();
    });

    it('wrapper validateQuery works', async () => {
        const middleware = validateQuery(schemas.pagination);
        const req = makeReq({ query: { page: '1' } });
        await middleware(req, makeRes(), nextMock);
        expect(nextMock).toHaveBeenCalledWith();
        expect(req.query).toEqual({ page: 1 });
    });

    it('wrapper validateParams works', async () => {
        const middleware = validateParams(schemas.common.id);
        const req = makeReq({ params: { id: '456' } });
        await middleware(req, makeRes(), nextMock);
        expect(nextMock).toHaveBeenCalledWith();
        expect(req.params).toEqual({ id: '456' });
    });
});
