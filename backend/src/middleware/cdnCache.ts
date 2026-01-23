import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to set Cache-Control headers for CDN and browser caching.
 * @param ttlSeconds Time to live in seconds
 */
export const cdnCache = (ttlSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    res.set('Cache-Control', `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}`);
    res.set('Vary', 'Accept-Encoding');
    next();
  };
};
