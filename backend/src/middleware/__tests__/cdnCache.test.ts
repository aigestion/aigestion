import { cdnCache } from '../cdnCache';
import { Request, Response, NextFunction } from 'express';

describe('cdnCache Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      set: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should set Cache-Control and Vary headers for GET requests', () => {
    mockRequest.method = 'GET';
    const ttl = 60;
    const middleware = cdnCache(ttl);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.set).toHaveBeenCalledWith(
      'Cache-Control',
      `public, max-age=${ttl}, s-maxage=${ttl}`,
    );
    expect(mockResponse.set).toHaveBeenCalledWith('Vary', 'Accept-Encoding');
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should ignore non-GET requests', () => {
    mockRequest.method = 'POST';
    const middleware = cdnCache(60);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.set).not.toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });
});
