import { useCallback, useEffect, useState } from 'react';

export interface ErrorContext {
  readonly url: string;
  readonly userAgent: string;
  readonly userId?: string;
  readonly sessionId: string;
  readonly timestamp: number;
  readonly referrer: string;
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
  readonly device: {
    readonly type: string;
    readonly os: string;
    readonly browser: string;
  };
  readonly network: {
    readonly type: string;
    readonly effectiveType: string;
    readonly downlink: number;
    readonly rtt: number;
  };
  readonly memory?: {
    readonly usedJSHeapSize: number;
    readonly totalJSHeapSize: number;
    readonly jsHeapSizeLimit: number;
  };
  readonly customData?: Record<string, any>;
}

export interface ErrorReport {
  readonly id: string;
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly type: 'javascript' | 'network' | 'resource' | 'unhandledrejection';
  readonly level: 'error' | 'warning' | 'info' | 'debug';
  readonly context: ErrorContext;
  readonly fingerprint: string;
  readonly tags?: string[];
  readonly breadcrumbs: Array<{
    readonly timestamp: number;
    readonly message: string;
    readonly category: string;
    readonly level: string;
    readonly data?: any;
  }>;
}

export interface ErrorTrackingConfig {
  readonly endpoint?: string;
  readonly apiKey?: string;
  readonly userId?: string;
  readonly enableConsoleCapture?: boolean;
  readonly enableNetworkCapture?: boolean;
  readonly enableBreadcrumbs?: boolean;
  readonly maxBreadcrumbs?: number;
  readonly environment?: string;
  readonly release?: string;
  readonly debugMode?: boolean;
  readonly sampleRate?: number;
  readonly ignoreErrors?: RegExp[];
}

export function useErrorTracking(config: ErrorTrackingConfig = {}) {
  const {
    endpoint = '/api/error-tracking',
    apiKey,
    userId,
    enableConsoleCapture = true,
    enableNetworkCapture = true,
    enableBreadcrumbs = true,
    maxBreadcrumbs = 50,
    environment = 'production',
    release,
    debugMode = false,
    sampleRate = 1.0,
    ignoreErrors = [],
  } = config;

  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<ErrorReport['breadcrumbs']>([]);

  // Generate unique session ID
  const sessionId = useState(() =>
    'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  )[0];

  // Generate error fingerprint
  const generateFingerprint = useCallback((error: Error, context: ErrorContext): string => {
    const fingerprintData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      url: context.url,
      userAgent: context.userAgent,
    };

    // Simple hash function for fingerprinting
    const str = JSON.stringify(fingerprintData);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }, []);

  // Get device information
  const getDeviceInfo = useCallback(() => {
    const ua = navigator.userAgent;

    let deviceType = 'desktop';
    if (/tablet|iPad|Android(?!.*Mobile)|Safari/i.test(ua)) {
      deviceType = 'tablet';
    } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      deviceType = 'mobile';
    }

    let os = 'unknown';
    if (ua.includes('Windows')) os = 'windows';
    else if (ua.includes('Mac')) os = 'macos';
    else if (ua.includes('Linux')) os = 'linux';
    else if (ua.includes('Android')) os = 'android';
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'ios';

    let browser = 'unknown';
    if (ua.includes('Chrome')) browser = 'chrome';
    else if (ua.includes('Firefox')) browser = 'firefox';
    else if (ua.includes('Safari')) browser = 'safari';
    else if (ua.includes('Edge')) browser = 'edge';
    else if (ua.includes('Opera')) browser = 'opera';

    return { type: deviceType, os, browser };
  }, []);

  // Get network information
  const getNetworkInfo = useCallback(() => {
    const connection = (navigator as any).connection || {};
    return {
      type: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
    };
  }, []);

  // Get memory information
  const getMemoryInfo = useCallback(() => {
    if ((performance as any).memory) {
      return (performance as any).memory;
    }
    return undefined;
  }, []);

  // Create error context
  const createErrorContext = useCallback((): ErrorContext => {
    return {
      url: globalThis.location.href,
      userAgent: navigator.userAgent,
      userId,
      sessionId,
      timestamp: Date.now(),
      referrer: document.referrer,
      viewport: {
        width: globalThis.innerWidth,
        height: globalThis.innerHeight,
      },
      device: getDeviceInfo(),
      network: getNetworkInfo(),
      memory: getMemoryInfo(),
    };
  }, [userId, getDeviceInfo, getNetworkInfo, getMemoryInfo]);

  // Add breadcrumb
  const addBreadcrumb = useCallback((
    message: string,
    category: string,
    level: string = 'info',
    data?: any
  ) => {
    if (!enableBreadcrumbs) return;

    const breadcrumb = {
      timestamp: Date.now(),
      message,
      category,
      level,
      data,
    };

    setBreadcrumbs(prev => {
      const updated = [...prev, breadcrumb];
      return updated.slice(-maxBreadcrumbs);
    });
  }, [enableBreadcrumbs, maxBreadcrumbs]);

  // Check if error should be ignored
  const shouldIgnoreError = useCallback((error: Error): boolean => {
    return ignoreErrors.some(pattern => pattern.test(error.message));
  }, [ignoreErrors]);

  // Send error to tracking service
  const sendError = useCallback(async (errorReport: ErrorReport) => {
    if (!endpoint || Math.random() > sampleRate) return;

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
        },
        body: JSON.stringify(errorReport),
      });

      if (debugMode) {
        console.log('Error Tracking: Error sent', errorReport);
      }
    } catch (err) {
      if (debugMode) {
        console.error('Error Tracking: Failed to send error', err);
      }
    }
  }, [endpoint, apiKey, sampleRate, debugMode]);

  // Capture JavaScript error
  const captureError = useCallback((
    error: Error,
    level: ErrorReport['level'] = 'error',
    tags?: string[],
    customData?: Record<string, any>
  ) => {
    if (shouldIgnoreError(error)) return;

    const context = createErrorContext();
    if (customData) {
      context.customData = { ...context.customData, ...customData };
    }

    const errorReport: ErrorReport = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: 'javascript',
      level,
      context,
      fingerprint: generateFingerprint(error, context),
      tags,
      breadcrumbs: [...breadcrumbs],
    };

    setErrors(prev => [...prev, errorReport]);
    sendError(errorReport);
  }, [shouldIgnoreError, createErrorContext, generateFingerprint, breadcrumbs, sendError]);

  // Capture network error
  const captureNetworkError = useCallback((
    url: string,
    status: number,
    error: string,
    level: ErrorReport['level'] = 'error'
  ) => {
    const context = createErrorContext();

    const errorReport: ErrorReport = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      name: 'NetworkError',
      message: `Network error: ${status} - ${error}`,
      stack: `URL: ${url}`,
      type: 'network',
      level,
      context,
      fingerprint: `network_${status}_${url}`,
      breadcrumbs: [...breadcrumbs],
    };

    setErrors(prev => [...prev, errorReport]);
    sendError(errorReport);
  }, [createErrorContext, breadcrumbs, sendError]);

  // Capture resource error
  const captureResourceError = useCallback((
    url: string,
    error: string,
    level: ErrorReport['level'] = 'error'
  ) => {
    const context = createErrorContext();

    const errorReport: ErrorReport = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      name: 'ResourceError',
      message: `Resource error: ${error}`,
      stack: `URL: ${url}`,
      type: 'resource',
      level,
      context,
      fingerprint: `resource_${url}`,
      breadcrumbs: [...breadcrumbs],
    };

    setErrors(prev => [...prev, errorReport]);
    sendError(errorReport);
  }, [createErrorContext, breadcrumbs, sendError]);

  // Setup global error handlers
  useEffect(() => {
    if (isTracking) return;

    setIsTracking(true);

    // JavaScript errors
    const handleError = (event: ErrorEvent) => {
      captureError(new Error(event.message), 'error', ['javascript'], {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    // Unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(event.reason?.message || event.reason || 'Unhandled Promise Rejection');
      captureError(error, 'error', ['unhandledrejection'], {
        reason: event.reason,
      });
    };

    // Resource errors
    const handleResourceError = (event: Event) => {
      const target = event.target as any;
      if (target) {
        const url = target.src || target.href;
        captureResourceError(url, 'Failed to load resource');
      }
    };

    // Network errors (fetch)
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok && enableNetworkCapture) {
          const url = args[0] as string;
          captureNetworkError(url, response.status, response.statusText);
        }

        return response;
      } catch (error) {
        if (enableNetworkCapture) {
          const url = args[0] as string;
          captureNetworkError(url, 0, error instanceof Error ? error.message : 'Network error');
        }
        throw error;
      }
    };

    // Console capture
    if (enableConsoleCapture) {
      const originalConsole = { ...console } as any;

      ['error', 'warn', 'info'].forEach(level => {
        (console as any)[level] = (...args: any[]) => {
          originalConsole[level](...args);

          if (args.length > 0 && typeof args[0] === 'string') {
            addBreadcrumb(args[0], 'console', level, { args });
          }
        };
      });
    }

    // Add event listeners
    globalThis.addEventListener('error', handleError);
    globalThis.addEventListener('unhandledrejection', handleUnhandledRejection);
    globalThis.addEventListener('error', handleResourceError, true);

    // Initial breadcrumb
    addBreadcrumb('Error tracking initialized', 'system', 'info');

    return () => {
      globalThis.removeEventListener('error', handleError);
      globalThis.removeEventListener('unhandledrejection', handleUnhandledRejection);
      globalThis.removeEventListener('error', handleResourceError, true);
      globalThis.fetch = originalFetch;
    };
  }, [
    isTracking,
    captureError,
    captureNetworkError,
    captureResourceError,
    enableNetworkCapture,
    enableConsoleCapture,
    addBreadcrumb,
  ]);

  // Manual error capture methods
  const captureException = useCallback((exception: any, tags?: string[]) => {
    const error = exception instanceof Error ? exception : new Error(String(exception));
    captureError(error, 'error', tags);
  }, [captureError]);

  const captureMessage = useCallback((message: string, level: ErrorReport['level'] = 'info', tags?: string[]) => {
    const error = new Error(message);
    captureError(error, level, tags);
  }, [captureError]);

  const captureUserFeedback = useCallback((feedback: string, rating?: number) => {
    const error = new Error(`User feedback: ${feedback}`);
    captureError(error, 'info', ['user-feedback'], { rating });
  }, [captureError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorStats = useCallback(() => {
    const stats = {
      total: errors.length,
      byLevel: {
        error: errors.filter(e => e.level === 'error').length,
        warning: errors.filter(e => e.level === 'warning').length,
        info: errors.filter(e => e.level === 'info').length,
        debug: errors.filter(e => e.level === 'debug').length,
      },
      byType: {
        javascript: errors.filter(e => e.type === 'javascript').length,
        network: errors.filter(e => e.type === 'network').length,
        resource: errors.filter(e => e.type === 'resource').length,
        unhandledrejection: errors.filter(e => e.type === 'unhandledrejection').length,
      },
      recent: errors.filter(e => Date.now() - e.context.timestamp < 3600000).length, // Last hour
    };

    return stats;
  }, [errors]);

  return {
    errors,
    isTracking,
    breadcrumbs,
    captureError,
    captureException,
    captureMessage,
    captureNetworkError,
    captureResourceError,
    captureUserFeedback,
    addBreadcrumb,
    clearErrors,
    getErrorStats,
    sessionId,
  };
}

// Error Boundary Component
export function ErrorBoundary({
  children,
  fallback,
  onError,
}: {
  readonly children: React.ReactNode;
  readonly fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  readonly onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}) {
  const { captureError } = useErrorTracking();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      captureError(error, 'error', ['error-boundary']);
    };

    globalThis.addEventListener('error', handleError);
    return () => globalThis.removeEventListener('error', handleError);
  }, [captureError]);

  const handleCatch = (error: Error, errorInfo: React.ErrorInfo) => {
    setHasError(true);
    setError(error);

    captureError(error, 'error', ['error-boundary'], {
      componentStack: errorInfo.componentStack,
    });

    onError?.(error, errorInfo);
  };

  const reset = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError && error) {
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent error={error} reset={reset} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're sorry, but an unexpected error occurred.
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          {debugMode && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">
                Error Details
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Error Tracking Dashboard Component
export function ErrorTrackingDashboard() {
  const { errors, getErrorStats, clearErrors } = useErrorTracking();
  const stats = getErrorStats();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Error Tracking Dashboard
        </h2>
        <button
          onClick={clearErrors}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Clear Errors
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Errors
          </div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.byLevel.error}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Errors
          </div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.byLevel.warning}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Warnings
          </div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.recent}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Recent (1h)
          </div>
        </div>
      </div>

      {/* Error List */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Recent Errors
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {errors.slice(-10).reverse().map((error, index) => (
            <div
              key={error.id}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-red-600 dark:text-red-400">
                  {error.name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(error.context.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {error.message}
              </div>

              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {error.type}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {error.level}
                </span>
                {error.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {errors.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No errors reported
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
