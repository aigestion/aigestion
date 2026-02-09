import { Request, Response, NextFunction } from 'express';

/**
 * CDN Cache Middleware
 *
 * Sets Cache-Control and Vary headers for GET requests
 * to enable CDN caching.
 *
 * @param ttl - Time to live in seconds
 */
export const cdnCache = (ttl: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${ttl}, s-maxage=${ttl}`);
      res.set('Vary', 'Accept-Encoding');
    }
    next();
  };
};
