import { useEffect, useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://aigestion.net';
const CDN_URL = import.meta.env.VITE_CDN_URL || 'https://cdn.aigestion.net';

export interface SyntheticCheck {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly headers?: Record<string, string>;
  readonly body?: string;
  readonly expectedStatus: number;
  readonly timeout: number;
  readonly interval: number;
  readonly retries: number;
  readonly locations: string[];
  readonly tags?: string[];
}

export interface SyntheticResult {
  readonly checkId: string;
  readonly timestamp: number;
  readonly location: string;
  readonly status: 'success' | 'failure' | 'timeout';
  readonly responseTime: number;
  readonly statusCode?: number;
  readonly error?: string;
  readonly responseHeaders?: Record<string, string>;
  readonly responseBody?: string;
  readonly metadata?: Record<string, any>;
}

export interface SyntheticConfig {
  readonly endpoint?: string;
  readonly apiKey?: string;
  readonly enableAutoRetry?: boolean;
  readonly defaultTimeout?: number;
  readonly defaultRetries?: number;
  readonly enableLogging?: boolean;
  readonly enableNotifications?: boolean;
  readonly alertThreshold?: number;
}

export interface SyntheticMonitor {
  readonly checks: SyntheticCheck[];
  readonly results: SyntheticResult[];
  readonly stats: {
    readonly totalChecks: number;
    readonly successfulChecks: number;
    readonly failedChecks: number;
    readonly averageResponseTime: number;
    readonly uptime: number;
    readonly lastCheck: number;
  };
}

export function useSyntheticMonitoring(config: SyntheticConfig = {}) {
  const {
    endpoint = '/api/synthetic-monitoring',
    apiKey,
    enableAutoRetry = true,
    defaultTimeout = 10000,
    defaultRetries = 3,
    enableLogging = true,
    enableNotifications = true,
    alertThreshold = 3,
  } = config;

  const [checks, setChecks] = useState<SyntheticCheck[]>([]);
  const [results, setResults] = useState<SyntheticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Default checks for AIGestion
  const defaultChecks: SyntheticCheck[] = [
    {
      id: 'homepage-check',
      name: 'Homepage Health Check',
      url: SITE_URL,
      method: 'GET',
      expectedStatus: 200,
      timeout: 10000,
      interval: 60000, // 1 minute
      retries: 3,
      locations: ['us-east-1', 'eu-west-1'],
      tags: ['critical', 'homepage'],
    },
    {
      id: 'api-health-check',
      name: 'API Health Check',
      url: `${API_BASE_URL}/v1/health`,
      method: 'GET',
      expectedStatus: 200,
      timeout: 5000,
      interval: 30000, // 30 seconds
      retries: 2,
      locations: ['us-east-1'],
      tags: ['critical', 'api'],
    },
    {
      id: 'auth-check',
      name: 'Authentication Service Check',
      url: `${API_BASE_URL}/v1/auth/status`,
      method: 'GET',
      expectedStatus: 200,
      timeout: 8000,
      interval: 120000, // 2 minutes
      retries: 3,
      locations: ['us-east-1', 'eu-west-1'],
      tags: ['important', 'auth'],
    },
    {
      id: 'database-check',
      name: 'Database Connection Check',
      url: `${API_BASE_URL}/v1/health/detailed`,
      method: 'GET',
      expectedStatus: 200,
      timeout: 5000,
      interval: 180000, // 3 minutes
      retries: 2,
      locations: ['us-east-1'],
      tags: ['important', 'database'],
    },
    {
      id: 'cdn-check',
      name: 'CDN Performance Check',
      url: `${CDN_URL}/health`,
      method: 'GET',
      expectedStatus: 200,
      timeout: 3000,
      interval: 60000, // 1 minute
      retries: 2,
      locations: ['global'],
      tags: ['performance', 'cdn'],
    },
  ];

  // Execute a single check
  const executeCheck = useCallback(
    async (check: SyntheticCheck, location: string = 'default'): Promise<SyntheticResult> => {
      const startTime = Date.now();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), check.timeout);

        const response = await fetch(check.url, {
          method: check.method,
          headers: {
            'User-Agent': 'AIGestion-Synthetic-Monitor/1.0',
            'X-Location': location,
            'X-Check-ID': check.id,
            ...check.headers,
          },
          body: check.body,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        let responseBody: string | undefined;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseBody = await response.text();
        }

        const result: SyntheticResult = {
          checkId: check.id,
          timestamp: startTime,
          location,
          status: response.status === check.expectedStatus ? 'success' : 'failure',
          responseTime,
          statusCode: response.status,
          responseHeaders,
          responseBody,
          metadata: {
            url: check.url,
            method: check.method,
            tags: check.tags,
          },
        };

        if (enableLogging) {
          console.log(`Synthetic Check ${check.id} (${location}):`, result);
        }

        return result;
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        const result: SyntheticResult = {
          checkId: check.id,
          timestamp: startTime,
          location,
          status: 'failure',
          responseTime,
          error: errorMessage,
          metadata: {
            url: check.url,
            method: check.method,
            tags: check.tags,
          },
        };

        if (enableLogging) {
          console.error(`Synthetic Check ${check.id} (${location}) failed:`, result);
        }

        return result;
      }
    },
    [enableLogging]
  );

  // Execute check with retries
  const executeCheckWithRetries = useCallback(
    async (check: SyntheticCheck, location: string = 'default'): Promise<SyntheticResult> => {
      let lastResult: SyntheticResult | null = null;

      for (let attempt = 1; attempt <= check.retries; attempt++) {
        try {
          const result = await executeCheck(check, location);

          if (result.status === 'success') {
            return result;
          }

          lastResult = result;

          if (attempt < check.retries) {
            // Exponential backoff
            const delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (error) {
          if (attempt === check.retries) {
            throw error;
          }

          // Exponential backoff
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      return lastResult!;
    },
    [executeCheck]
  );

  // Execute all checks
  const executeAllChecks = useCallback(async () => {
    setIsRunning(true);
    const allResults: SyntheticResult[] = [];

    try {
      for (const check of checks) {
        for (const location of check.locations) {
          try {
            const result = await executeCheckWithRetries(check, location);
            allResults.push(result);
          } catch (error) {
            const errorResult: SyntheticResult = {
              checkId: check.id,
              timestamp: Date.now(),
              location,
              status: 'failure',
              responseTime: 0,
              error: error instanceof Error ? error.message : 'Unknown error',
              metadata: {
                url: check.url,
                method: check.method,
                tags: check.tags,
              },
            };
            allResults.push(errorResult);
          }
        }
      }

      setResults(prev => [...prev, ...allResults]);

      // Send results to server
      if (endpoint) {
        await sendResults(allResults);
      }

      // Check for alerts
      if (enableNotifications) {
        checkForAlerts(allResults);
      }
    } finally {
      setIsRunning(false);
    }

    return allResults;
  }, [checks, executeCheckWithRetries, endpoint, enableNotifications]);

  // Send results to server
  const sendResults = useCallback(
    async (results: SyntheticResult[]) => {
      if (!endpoint) return;

      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
          },
          body: JSON.stringify({
            results,
            timestamp: Date.now(),
            source: 'synthetic-monitoring',
          }),
        });

        if (enableLogging) {
          console.log('Synthetic monitoring results sent:', results.length);
        }
      } catch (error) {
        if (enableLogging) {
          console.error('Failed to send synthetic monitoring results:', error);
        }
      }
    },
    [endpoint, apiKey, enableLogging]
  );

  // Check for alerts
  const checkForAlerts = useCallback(
    (results: SyntheticResult[]) => {
      const failedResults = results.filter(r => r.status === 'failure');

      if (failedResults.length >= alertThreshold) {
        // Send notification
        if ('Notification' in globalThis && Notification.permission === 'granted') {
          new Notification('AIGestion Alert', {
            body: `${failedResults.length} synthetic checks failed`,
            icon: '/icons/icon-192x192.png',
            tag: 'synthetic-alert',
          });
        }

        // Could also send to Slack, email, etc.
        if (enableLogging) {
          console.warn(`Synthetic monitoring alert: ${failedResults.length} checks failed`);
        }
      }
    },
    [alertThreshold, enableLogging]
  );

  // Get statistics
  const getStats = useCallback(() => {
    if (results.length === 0) {
      return {
        totalChecks: 0,
        successfulChecks: 0,
        failedChecks: 0,
        averageResponseTime: 0,
        uptime: 100,
        lastCheck: 0,
      };
    }

    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failure');
    const totalResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0);

    return {
      totalChecks: results.length,
      successfulChecks: successful.length,
      failedChecks: failed.length,
      averageResponseTime: totalResponseTime / results.length,
      uptime: (successful.length / results.length) * 100,
      lastCheck: Math.max(...results.map(r => r.timestamp)),
    };
  }, [results]);

  // Add check
  const addCheck = useCallback((check: SyntheticCheck) => {
    setChecks(prev => [...prev, check]);
  }, []);

  // Remove check
  const removeCheck = useCallback((checkId: string) => {
    setChecks(prev => prev.filter(c => c.id !== checkId));
  }, []);

  // Update check
  const updateCheck = useCallback((checkId: string, updates: Partial<SyntheticCheck>) => {
    setChecks(prev => prev.map(c => (c.id === checkId ? { ...c, ...updates } : c)));
  }, []);

  // Clear results
  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isRunning) return;

    // Execute immediately
    executeAllChecks();

    // Set up interval for regular checks
    const interval = setInterval(() => {
      executeAllChecks();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isRunning, executeAllChecks]);

  // Initialize with default checks
  useEffect(() => {
    setChecks(defaultChecks);
  }, []);

  return {
    checks,
    results,
    isRunning,
    stats: getStats(),
    executeCheck,
    executeAllChecks,
    addCheck,
    removeCheck,
    updateCheck,
    clearResults,
    startMonitoring,
  };
}

// Synthetic Monitoring Dashboard Component
export function SyntheticMonitoringDashboard() {
  const { checks, results, isRunning, stats, executeAllChecks, addCheck, removeCheck } =
    useSyntheticMonitoring();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'failure':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900';
      case 'failure':
        return 'bg-red-100 dark:bg-red-900';
      default:
        return 'bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Synthetic Monitoring</h2>
        <div className="flex gap-2">
          <button
            onClick={executeAllChecks}
            disabled={isRunning}
            className={`px-4 py-2 rounded transition-colors ${
              isRunning
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? 'Running...' : 'Run All Checks'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalChecks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Checks</div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.successfulChecks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.failedChecks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.uptime.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.averageResponseTime.toFixed(0)}ms
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
        </div>
      </div>

      {/* Checks List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Active Checks</h3>
        <div className="space-y-2">
          {checks.map(check => {
            const latestResult = results
              .filter(r => r.checkId === check.id)
              .sort((a, b) => b.timestamp - a.timestamp)[0];

            return (
              <div
                key={check.id}
                className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{check.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{check.url}</div>
                  <div className="flex gap-2 mt-1">
                    {check.tags?.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  {latestResult ? (
                    <>
                      <div className={`font-medium ${getStatusColor(latestResult.status)}`}>
                        {latestResult.status.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {latestResult.responseTime}ms
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(latestResult.timestamp).toLocaleTimeString()}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500">Not checked yet</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Recent Results</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {results
            .slice(-10)
            .reverse()
            .map((result, index) => (
              <div
                key={`${result.checkId}-${result.location}-${index}`}
                className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{result.checkId}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {result.location} • {result.metadata?.url}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-medium ${getStatusColor(result.status)}`}>
                    {result.status.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {result.responseTime}ms
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

          {results.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No results yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
