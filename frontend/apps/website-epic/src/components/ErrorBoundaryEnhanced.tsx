import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * Error Boundary mejorado con fallback UI elegante
 * Proporciona recuperación automática y logging detallado
 */
export class ErrorBoundaryEnhanced extends Component<Props, State> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: ErrorBoundaryEnhanced.generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error details
    this.logError(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset on prop changes if enabled
    if (resetOnPropsChange && hasError) {
      if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
        this.reset();
      }
    }

    // Reset when resetKeys change
    if (resetKeys && hasError) {
      const prevKeys = JSON.stringify(prevProps.resetKeys || []);
      const currentKeys = JSON.stringify(resetKeys);
      
      if (prevKeys !== currentKeys) {
        this.reset();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private generateErrorId = (): string => {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  private static generateErrorId = (): string => {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error ID:', this.state.errorId);
      console.groupEnd();
    }

    // Log to external service (Sentry, etc.)
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          errorBoundary: true,
          errorId: this.state.errorId,
        },
      });
    }

    // Store in localStorage for debugging
    try {
      const errorLog = {
        id: this.state.errorId,
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      const existingLogs = JSON.parse(localStorage.getItem('error-logs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 50 errors
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('error-logs', JSON.stringify(existingLogs));
    } catch (e) {
      console.warn('Failed to log error to localStorage:', e);
    }
  };

  private reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    });
  };

  private retryWithDelay = () => {
    this.resetTimeoutId = setTimeout(() => {
      this.reset();
    }, 1000);
  };

  private copyErrorDetails = () => {
    const { error, errorInfo, errorId } = this.state;
    const details = `
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}

Error: ${error?.name}
Message: ${error?.message}
Stack: ${error?.stack}

Component Stack: ${errorInfo?.componentStack}
    `.trim();

    navigator.clipboard.writeText(details).then(() => {
      // Show success feedback
      const button = document.getElementById('copy-error-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    });
  };

  render() {
    const { hasError, error, errorId } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback component
      if (fallback) {
        return <>{fallback}</>;
      }

      // Default fallback UI
      return (
        <motion.div
          className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 text-center">
            {/* Error Icon */}
            <motion.div
              className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
            >
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </motion.div>

            {/* Error Message */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. The error has been logged and our team will look into it.
            </p>

            {/* Error ID */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Error ID</p>
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {errorId}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.reset}
                className="w-full bg-nexus-cyan text-white px-4 py-2 rounded-lg hover:bg-nexus-cyan-dark transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={this.retryWithDelay}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Retry in 1 Second
              </button>

              {process.env.NODE_ENV === 'development' && (
                <button
                  id="copy-error-btn"
                  onClick={this.copyErrorDetails}
                  className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-sm"
                >
                  Copy Error Details
                </button>
              )}
            </div>

            {/* Development Details */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                  Error Details (Development Only)
                </summary>
                <div className="mt-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-xs font-mono overflow-auto max-h-40">
                  <div className="text-red-600 dark:text-red-400">{error.name}</div>
                  <div className="text-gray-800 dark:text-gray-200 mt-1">{error.message}</div>
                  {error.stack && (
                    <pre className="text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Additional Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                If the problem persists, you can:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-nexus-cyan hover:text-nexus-cyan-dark transition-colors"
                >
                  Refresh the page
                </button>
                <span className="text-gray-400 mx-2">•</span>
                <button
                  onClick={() => window.history.back()}
                  className="text-sm text-nexus-cyan hover:text-nexus-cyan-dark transition-colors"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return children;
  }
}

/**
 * Functional Error Boundary Hook
 */
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  // Throw error to be caught by ErrorBoundary
  if (error) {
    throw error;
  }

  return { captureError, resetError };
};

/**
 * HOC para envolver componentes con Error Boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryEnhanced {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryEnhanced>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};
