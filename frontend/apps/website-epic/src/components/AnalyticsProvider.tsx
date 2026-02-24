import React, { useEffect } from 'react';
import { analytics } from '../services/analytics.service';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize analytics
    analytics.initialize();

    // Track page changes
    const handleRouteChange = () => {
      analytics.trackPageView();
    };

    // Listen for route changes (for SPA)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleRouteChange);
      
      // Override pushState to track navigation
      const originalPushState = window.history.pushState;
      window.history.pushState = function(state, title, url) {
        originalPushState.call(this, state, title, url);
        setTimeout(handleRouteChange, 0);
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleRouteChange);
      }
    };
  }, []);

  return <>{children}</>;
};

// Custom hooks for easy tracking
export const useAnalytics = () => {
  const trackFeature = (featureName: string, category: string) => {
    analytics.trackFeatureUsed(featureName, category);
  };

  const trackAIChat = (model: string, sessionId: string, isStart: boolean) => {
    if (isStart) {
      analytics.trackAIChatStart(model, sessionId);
    } else {
      analytics.trackAIChatEnd(model, sessionId, 0);
    }
  };

  const trackError = (error: Error, context?: string) => {
    analytics.trackError(error.name, error.message, context);
  };

  const trackPerformance = (metricName: string, value: number, unit: string = 'ms') => {
    analytics.trackPerformanceMetric(metricName, value, unit);
  };

  return {
    trackFeature,
    trackAIChat,
    trackError,
    trackPerformance,
    analytics
  };
};
