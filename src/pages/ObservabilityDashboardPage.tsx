import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/Layout';
import PageTitle from '@/components/common/PageTitle';
import ObservabilityMetricCard from '@/components/features/observability/dashboard/ObservabilityMetricCard';
import ObservabilityPerformancePanel from '@/components/features/observability/dashboard/ObservabilityPerformancePanel';
import { observabilityService } from '@/services/api/observability.service';
import type { ObservabilityStatsResponse, ObservabilityStatusValue } from '@/types/observability.types';
import { BoltIcon, ClockIcon, ExclamationTriangleIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { FeedbackContext } from '@/context/FeedbackContext';

const buildMiniSeries = (value: number) => {
  const base = value || 0;
  const start = base * 0.8;
  const end = base;
  return [0, 1, 2, 3, 4, 5, 6].map((t, idx, arr) => ({
    t,
    value: start + (end - start) * (idx / Math.max(1, arr.length - 1)),
  }));
};

const statusToBadgeVariant = (status: ObservabilityStatusValue | undefined): 'warning' | 'success' | 'info' | 'default' | 'error' => {
  if (!status) return 'default';
  if (status === 'success') return 'success';
  if (status === 'warning') return 'warning';
  if (status === 'error') return 'error';
  return 'info';
};

const statusToBorderClass = (status: ObservabilityStatusValue | undefined): string => {
  if (!status) return 'border-gray-200';
  if (status === 'success') return 'border-green-500';
  if (status === 'warning') return 'border-yellow-500';
  if (status === 'error') return 'border-red-500';
  return 'border-blue-500';
};

export default function ObservabilityDashboardPage() {
  const [stats, setStats] = useState<ObservabilityStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const feedbackCtx = useContext(FeedbackContext);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    // Show loading message when refresh starts
    if (feedbackCtx) {
      feedbackCtx.setFeedbackMessage('Refreshing stats...');
      feedbackCtx.setFeedbackStatus(undefined); // Info status (blue)
    }
    
    try {
      const data = await observabilityService.getStats();
      setStats(data);
      
      // Show success message in header feedback component
      if (feedbackCtx) {
        feedbackCtx.setFeedbackMessage('Stats are Updated');
        feedbackCtx.setFeedbackStatus(200);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load observability stats';
      setError(message);
      
      // Show error message in header feedback component
      if (feedbackCtx) {
        feedbackCtx.setFeedbackMessage(message);
        feedbackCtx.setFeedbackStatus(500);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const app = stats?.application_performance;
  const status = stats?.status;

  return (
    <AppLayout padded={true}>
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between mt-1 mb-4">
          <PageTitle>Observability Dashboard</PageTitle>
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gradient-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ObservabilityMetricCard
            title="Response Time"
            subtitle="Last 12 hours"
            badgeLabel={status?.response_time}
            badgeVariant={statusToBadgeVariant(status?.response_time)}
            value={app ? `${app.response_time_ms}ms` : '--'}
            icon={<ClockIcon className="h-4 w-4" />}
            data={buildMiniSeries(app?.response_time_ms ?? 0)}
            valueKey="value"
            borderColorClass={statusToBorderClass(status?.response_time)}
          />

          <ObservabilityMetricCard
            title="Throughput"
            subtitle="Requests per minute"
            badgeLabel={status?.throughput}
            badgeVariant={statusToBadgeVariant(status?.throughput)}
            value={app ? `${app.throughput_per_min.toFixed(2)}/min` : '--'}
            icon={<BoltIcon className="h-4 w-4" />}
            data={buildMiniSeries(app?.throughput_per_min ?? 0)}
            valueKey="value"
            borderColorClass={statusToBorderClass(status?.throughput)}
          />

          <ObservabilityMetricCard
            title="Error Rate"
            subtitle="Errors vs total requests"
            badgeLabel={status?.error_rate}
            badgeVariant={statusToBadgeVariant(status?.error_rate)}
            value={app ? `${app.error_rate_percent.toFixed(2)}%` : '--'}
            icon={<ExclamationTriangleIcon className="h-4 w-4" />}
            data={buildMiniSeries(app?.error_rate_percent ?? 0)}
            valueKey="value"
            borderColorClass={statusToBorderClass(status?.error_rate)}
            chartType="bar"
          />

          <ObservabilityMetricCard
            title="LLM Calls"
            subtitle="Total processed calls"
            badgeLabel={status?.llm_calls}
            badgeVariant={statusToBadgeVariant(status?.llm_calls)}
            value={app ? `${app.total_llm_calls}` : '--'}
            icon={<UsersIcon className="h-4 w-4" />}
            data={buildMiniSeries(app?.total_llm_calls ?? 0)}
            valueKey="value"
            borderColorClass={statusToBorderClass(status?.llm_calls)}
          />
        </div>

        <ObservabilityPerformancePanel
          systemPerformance={stats?.system_performance ?? null}
          applicationPerformance={stats?.application_performance ?? null}
          metricStatus={stats?.status ?? null}
          onRefresh={fetchStats}
          loading={loading}
        />
      </div>
    </AppLayout>
  );
}
