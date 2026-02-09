import { useCallback, useEffect, useRef, useState } from 'react';

export interface ABTestVariant {
  readonly id: string;
  readonly name: string;
  readonly weight: number; // 0-1
  readonly config?: Record<string, any>;
}

export interface ABTest {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly variants: ABTestVariant[];
  readonly trafficAllocation: number; // 0-1
  readonly startDate?: string;
  readonly endDate?: string;
  readonly targetAudience?: {
    readonly country?: string[];
    readonly device?: string[];
    readonly browser?: string[];
    readonly customAttributes?: Record<string, any>;
  };
}

export interface ABTestResult {
  readonly testId: string;
  readonly variantId: string;
  readonly userId?: string;
  readonly timestamp: number;
  readonly url: string;
  readonly userAgent: string;
  readonly sessionId: string;
  readonly customAttributes?: Record<string, any>;
}

export interface ABTestConfig {
  readonly endpoint?: string;
  readonly apiKey?: string;
  readonly userId?: string;
  readonly enableLogging?: boolean;
  readonly persistToLocalStorage?: boolean;
  readonly debugMode?: boolean;
}

export interface ABTestMetrics {
  readonly testId: string;
  readonly variantId: string;
  readonly conversions: number;
  readonly impressions: number;
  readonly conversionRate: number;
  readonly revenue?: number;
  readonly averageOrderValue?: number;
}

export function useABTesting(config: ABTestConfig = {}) {
  const {
    endpoint = '/api/ab-testing',
    apiKey,
    userId,
    enableLogging = true,
    persistToLocalStorage = true,
    debugMode = false,
  } = config;

  const [tests, setTests] = useState<ABTest[]>([]);
  const [assignments, setAssignments] = useState<Map<string, ABTestResult>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionId = useRef(generateSessionId());

  // Generate session ID
  function generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Generate user ID if not provided
  const generateUserId = useCallback((): string => {
    const stored = localStorage.getItem('ab_user_id');
    if (stored) return stored;

    const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ab_user_id', newId);
    return newId;
  }, []);

  const currentUserId = userId || generateUserId();

  // Load tests from server
  const loadTests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Failed to load tests: ${response.statusText}`);
      }

      const data = await response.json();
      setTests(data.tests || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);

      if (enableLogging) {
        console.error('AB Testing: Failed to load tests', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, apiKey, enableLogging]);

  // Load saved assignments from localStorage
  const loadSavedAssignments = useCallback(() => {
    if (!persistToLocalStorage) return;

    try {
      const saved = localStorage.getItem('ab_assignments');
      if (saved) {
        const parsedAssignments = JSON.parse(saved);
        const assignmentsMap = new Map<string, ABTestResult>();

        Object.entries(parsedAssignments).forEach(([testId, result]) => {
          assignmentsMap.set(testId, result as ABTestResult);
        });

        setAssignments(assignmentsMap);
      }
    } catch (err) {
      if (enableLogging) {
        console.error('AB Testing: Failed to load saved assignments', err);
      }
    }
  }, [persistToLocalStorage, enableLogging]);

  // Save assignments to localStorage
  const saveAssignments = useCallback(
    (assignmentsMap: Map<string, ABTestResult>) => {
      if (!persistToLocalStorage) return;

      try {
        const assignmentsObj: Record<string, ABTestResult> = {};
        assignmentsMap.forEach((result, testId) => {
          assignmentsObj[testId] = result;
        });

        localStorage.setItem('ab_assignments', JSON.stringify(assignmentsObj));
      } catch (err) {
        if (enableLogging) {
          console.error('AB Testing: Failed to save assignments', err);
        }
      }
    },
    [persistToLocalStorage, enableLogging]
  );

  // Check if user is in target audience
  const isInTargetAudience = useCallback((test: ABTest): boolean => {
    if (!test.targetAudience) return true;

    const { device, browser, customAttributes } = test.targetAudience;

    // Check device
    if (device && device.length > 0) {
      const userDevice = getDeviceType();
      if (!device.includes(userDevice)) return false;
    }

    // Check browser
    if (browser && browser.length > 0) {
      const userBrowser = getBrowserType();
      if (!browser.includes(userBrowser)) return false;
    }

    // Check custom attributes (would need to be implemented based on your needs)
    if (customAttributes) {
      // Implementation depends on your custom attribute tracking
    }

    return true;
  }, []);

  // Select variant for a test
  const selectVariant = useCallback(
    (test: ABTest): ABTestVariant | null => {
      // Check if test is active
      const now = new Date();
      if (test.startDate && new Date(test.startDate) > now) return null;
      if (test.endDate && new Date(test.endDate) < now) return null;

      // Check traffic allocation
      const random = Math.random();
      if (random > test.trafficAllocation) return null;

      // Check target audience
      if (!isInTargetAudience(test)) return null;

      // Select variant based on weights
      const userHash = hashString(currentUserId + test.id);
      const variantRandom = (userHash % 100) / 100;

      let cumulativeWeight = 0;
      for (const variant of test.variants) {
        cumulativeWeight += variant.weight;
        if (variantRandom <= cumulativeWeight) {
          return variant;
        }
      }

      return test.variants[0] || null;
    },
    [currentUserId, isInTargetAudience]
  );

  // Get or create assignment for a test
  const getAssignment = useCallback(
    (testId: string): ABTestResult | null => {
      // Check if already assigned
      if (assignments.has(testId)) {
        return assignments.get(testId)!;
      }

      // Find the test
      const test = tests.find(t => t.id === testId);
      if (!test) return null;

      // Select variant
      const variant = selectVariant(test);
      if (!variant) return null;

      // Create assignment
      const assignment: ABTestResult = {
        testId,
        variantId: variant.id,
        userId: currentUserId,
        timestamp: Date.now(),
        url: globalThis.location.href,
        userAgent: navigator.userAgent,
        sessionId: sessionId.current,
      };

      // Save assignment
      const newAssignments = new Map(assignments);
      newAssignments.set(testId, assignment);
      setAssignments(newAssignments);
      saveAssignments(newAssignments);

      // Track impression
      trackImpression(assignment);

      return assignment;
    },
    [tests, assignments, currentUserId, selectVariant, saveAssignments]
  );

  // Track impression
  const trackImpression = useCallback(
    async (assignment: ABTestResult) => {
      if (!endpoint) return;

      try {
        await fetch(`${endpoint}/impression`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
          },
          body: JSON.stringify(assignment),
        });

        if (debugMode) {
          console.log('AB Testing: Impression tracked', assignment);
        }
      } catch (err) {
        if (enableLogging) {
          console.error('AB Testing: Failed to track impression', err);
        }
      }
    },
    [endpoint, apiKey, enableLogging, debugMode]
  );

  // Track conversion
  const trackConversion = useCallback(
    async (testId: string, conversionValue?: number, customData?: Record<string, any>) => {
      const assignment = assignments.get(testId);
      if (!assignment) return;

      try {
        const conversionData = {
          ...assignment,
          conversionValue,
          customData,
          timestamp: Date.now(),
        };

        await fetch(`${endpoint}/conversion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
          },
          body: JSON.stringify(conversionData),
        });

        if (debugMode) {
          console.log('AB Testing: Conversion tracked', conversionData);
        }
      } catch (err) {
        if (enableLogging) {
          console.error('AB Testing: Failed to track conversion', err);
        }
      }
    },
    [assignments, endpoint, apiKey, enableLogging, debugMode]
  );

  // Get variant config
  const getVariantConfig = useCallback(
    (testId: string): any => {
      const assignment = assignments.get(testId);
      if (!assignment) return null;

      const test = tests.find(t => t.id === testId);
      if (!test) return null;

      const variant = test.variants.find(v => v.id === assignment.variantId);
      return variant?.config || null;
    },
    [assignments, tests]
  );

  // Check if user is in variant
  const isInVariant = useCallback(
    (testId: string, variantId: string): boolean => {
      const assignment = assignments.get(testId);
      return assignment?.variantId === variantId;
    },
    [assignments]
  );

  // Get test metrics
  const getTestMetrics = useCallback(
    async (testId: string): Promise<ABTestMetrics[]> => {
      if (!endpoint) return [];

      try {
        const response = await fetch(`${endpoint}/metrics/${testId}`, {
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        });

        if (!response.ok) {
          throw new Error(`Failed to get metrics: ${response.statusText}`);
        }

        return await response.json();
      } catch (err) {
        if (enableLogging) {
          console.error('AB Testing: Failed to get metrics', err);
        }
        return [];
      }
    },
    [endpoint, apiKey, enableLogging]
  );

  // Initialize
  useEffect(() => {
    loadTests();
    loadSavedAssignments();
  }, [loadTests, loadSavedAssignments]);

  return {
    tests,
    assignments,
    isLoading,
    error,
    getAssignment,
    getVariantConfig,
    isInVariant,
    trackConversion,
    getTestMetrics,
    currentUserId,
    sessionId: sessionId.current,
  };
}

// Utility functions
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function getDeviceType(): string {
  const ua = navigator.userAgent;

  if (/tablet|iPad|Android(?!.*Mobile)|Safari/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function getBrowserType(): string {
  const ua = navigator.userAgent;

  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Safari')) return 'safari';
  if (ua.includes('Edge')) return 'edge';
  if (ua.includes('Opera')) return 'opera';

  return 'unknown';
}

// AB Test Component Wrapper
export function ABTestWrapper({
  testId,
  variantId,
  children,
  fallback,
}: {
  readonly testId: string;
  readonly variantId: string;
  readonly children: React.ReactNode;
  readonly fallback?: React.ReactNode;
}) {
  const { isInVariant, getAssignment } = useABTesting();

  // Ensure assignment exists
  useEffect(() => {
    getAssignment(testId);
  }, [testId, getAssignment]);

  if (isInVariant(testId, variantId)) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
}

// A/B Testing Hook for specific test
export function useABTest(testId: string) {
  const { getAssignment, getVariantConfig, isInVariant, trackConversion } = useABTesting();

  const assignment = getAssignment(testId);
  const variantConfig = getVariantConfig(testId);

  const trackTestConversion = useCallback(
    (value?: number, data?: Record<string, any>) => {
      trackConversion(testId, value, data);
    },
    [testId, trackConversion]
  );

  return {
    assignment,
    variantConfig,
    isInVariant: (variantId: string) => isInVariant(testId, variantId),
    trackConversion: trackTestConversion,
  };
}

// A/B Testing Dashboard Component
export function ABTestingDashboard() {
  const { tests, assignments, getTestMetrics } = useABTesting();
  const [metrics, setMetrics] = useState<Record<string, ABTestMetrics[]>>({});

  useEffect(() => {
    const loadMetrics = async () => {
      const metricsData: Record<string, ABTestMetrics[]> = {};

      for (const test of tests) {
        const testMetrics = await getTestMetrics(test.id);
        metricsData[test.id] = testMetrics;
      }

      setMetrics(metricsData);
    };

    if (tests.length > 0) {
      loadMetrics();
    }
  }, [tests, getTestMetrics]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
        A/B Testing Dashboard
      </h2>

      <div className="space-y-6">
        {tests.map(test => {
          const testMetrics = metrics[test.id] || [];
          const assignment = assignments.get(test.id);

          return (
            <div
              key={test.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{test.description}</p>
                </div>

                {assignment && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">Variant:</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">{assignment.variantId}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {test.variants.map(variant => {
                  const variantMetrics = testMetrics.find(m => m.variantId === variant.id);
                  const conversionRate = variantMetrics?.conversionRate || 0;

                  return (
                    <div
                      key={variant.id}
                      className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {variant.name}
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {(conversionRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {variantMetrics?.impressions || 0} impressions
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
