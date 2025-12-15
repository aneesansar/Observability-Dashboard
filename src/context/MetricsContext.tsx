import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { observabilityService } from '@/services/api';
import type { ObservabilityMetricsSummary } from '@/services/api/observability.service';
import { parseObservabilityMetrics, type ParsedObservabilityMetrics } from '@/services/helpers/metricsParser';
import { FeedbackContext } from '@/context/FeedbackContext';

interface MetricsContextType {
  data: ParsedObservabilityMetrics | null;
  summary: ObservabilityMetricsSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

interface MetricsProviderProps {
  children: ReactNode;
}

export function MetricsProvider({ children }: MetricsProviderProps) {
  const [data, setData] = useState<ParsedObservabilityMetrics | null>(null);
  const [summary, setSummary] = useState<ObservabilityMetricsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const feedbackCtx = useContext(FeedbackContext);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    // Show loading message when refresh starts
    if (feedbackCtx) {
      feedbackCtx.setFeedbackMessage('Refreshing metrics...');
      feedbackCtx.setFeedbackStatus(undefined); // Info status (blue)
    }

    try {
      // Fetch both metrics endpoints in parallel
      const [raw, summaryData] = await Promise.all([
        observabilityService.getMetrics(),
        observabilityService.getMetricsSummary()
      ]);
      
      const parsed = parseObservabilityMetrics(raw);
      setData(parsed);
      setSummary(summaryData);

      // Show success message in header feedback component
      if (feedbackCtx) {
        feedbackCtx.setFeedbackMessage('Metrics updated successfully');
        feedbackCtx.setFeedbackStatus(200);
      }
    } catch (err: any) {
      const message = err?.message || 'Failed to load metrics';
      setError(message);
      
      // Show error message in header feedback component
      if (feedbackCtx) {
        feedbackCtx.setFeedbackMessage(message);
        feedbackCtx.setFeedbackStatus(500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialLoad = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch both metrics endpoints in parallel
        const [raw, summaryData] = await Promise.all([
          observabilityService.getMetrics(),
          observabilityService.getMetricsSummary()
        ]);
        
        if (!isMounted) return;
        
        const parsed = parseObservabilityMetrics(raw);
        setData(parsed);
        setSummary(summaryData);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Failed to load metrics');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initialLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = () => {
    void load();
  };

  const value = {
    data,
    summary,
    isLoading,
    error,
    refresh
  };

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetricsContext() {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error('useMetricsContext must be used within a MetricsProvider');
  }
  return context;
}
