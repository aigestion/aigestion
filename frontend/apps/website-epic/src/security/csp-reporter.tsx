import { useEffect, useState } from 'react';
import { CSPViolation, defaultCSPReporter } from './csp';

export interface CSPReport {
  readonly violations: CSPViolation[];
  readonly stats: {
    total: number;
    byDirective: Record<string, number>;
    recent: number;
  };
  readonly lastUpdated: string;
}

export function useCSPReporter() {
  const [report, setReport] = useState<CSPReport>({
    violations: [],
    stats: {
      total: 0,
      byDirective: {},
      recent: 0,
    },
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    // Set up global CSP violation handler
    const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
      const violation: CSPViolation = {
        blockedURI: event.blockedURI,
        columnNumber: event.columnNumber,
        disposition: event.disposition,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        lineNumber: event.lineNumber,
        originalPolicy: event.originalPolicy,
        referrer: event.referrer,
        sample: event.sample,
        sourceFile: event.sourceFile,
        statusCode: event.statusCode,
        violatedDirective: event.violatedDirective,
      };

      defaultCSPReporter.reportViolation(violation);
      updateReport();
    };

    globalThis.addEventListener('securitypolicyviolation', handleCSPViolation);

    // Initial report
    updateReport();

    return () => {
      globalThis.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, []);

  const updateReport = () => {
    const violations = defaultCSPReporter.getViolations();
    const stats = defaultCSPReporter.getViolationStats();

    setReport({
      violations,
      stats,
      lastUpdated: new Date().toISOString(),
    });
  };

  const clearViolations = () => {
    defaultCSPReporter.clearViolations();
    updateReport();
  };

  const getViolationsByDirective = (directive: string) => {
    return defaultCSPReporter.getViolationsByDirective(directive);
  };

  const getRecentViolations = (minutes: number = 60) => {
    return defaultCSPReporter.getRecentViolations(minutes);
  };

  return {
    report,
    clearViolations,
    getViolationsByDirective,
    getRecentViolations,
    updateReport,
  };
}

// CSP Report Dashboard Component
export function CSPReportDashboard() {
  const { report, clearViolations } = useCSPReporter();

  const getSeverityColor = (count: number): string => {
    if (count === 0) return 'text-green-600';
    if (count <= 5) return 'text-yellow-600';
    if (count <= 10) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSeverityBg = (count: number): string => {
    if (count === 0) return 'bg-green-100';
    if (count <= 5) return 'bg-yellow-100';
    if (count <= 10) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">CSP Security Report</h2>
        <button
          onClick={clearViolations}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Clear Violations
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {report.stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Violations</div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {report.stats.recent}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Last 60 Minutes</div>
        </div>

        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">Last Updated</div>
          <div className="text-sm font-mono text-gray-900 dark:text-white">
            {new Date(report.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Violations by Directive */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Violations by Directive
        </h3>
        <div className="space-y-2">
          {Object.entries(report.stats.byDirective).map(([directive, count]) => (
            <div
              key={directive}
              className={`flex justify-between items-center p-3 rounded-lg ${getSeverityBg(count)}`}
            >
              <span className="font-medium text-gray-900 dark:text-white">{directive}</span>
              <span className={`font-bold ${getSeverityColor(count)}`}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Violations */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Recent Violations
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {report.violations
            .slice(-10)
            .reverse()
            .map((violation, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {violation.violatedDirective}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(violation.timestamp || '').toLocaleString()}
                  </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Blocked URI:</strong> {violation.blockedURI}
                </div>

                {violation.documentURI && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Document:</strong> {violation.documentURI}
                  </div>
                )}

                {violation.lineNumber && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Line:</strong> {violation.lineNumber}
                    {violation.columnNumber && `:${violation.columnNumber}`}
                  </div>
                )}
              </div>
            ))}

          {report.violations.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No CSP violations reported
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// CSP Violation Alert Component
export function CSPViolationAlert() {
  const { report } = useCSPReporter();

  if (report.stats.total === 0) {
    return null;
  }

  const hasRecentViolations = report.stats.recent > 0;
  const hasHighSeverity = Object.values(report.stats.byDirective).some(count => count > 10);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm ${
        hasHighSeverity
          ? 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700'
          : hasRecentViolations
            ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700'
            : 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-xl">{hasHighSeverity ? '🚨' : hasRecentViolations ? '⚠️' : 'ℹ️'}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {hasHighSeverity
              ? 'High Severity CSP Violations'
              : hasRecentViolations
                ? 'CSP Violations Detected'
                : 'CSP Violations'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {report.stats.total} total violations ({report.stats.recent} in last hour)
          </p>

          <button
            onClick={() => {
              // Scroll to CSP report or show modal
              const element = document.getElementById('csp-report');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Details
          </button>
        </div>

        <button
          onClick={() => {
            const element = document.getElementById('csp-report-alert');
            if (element) {
              element.remove();
            }
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>
    </div>
  );
}
