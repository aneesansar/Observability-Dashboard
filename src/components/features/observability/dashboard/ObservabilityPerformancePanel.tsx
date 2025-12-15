import ObservabilityMetricCard from './ObservabilityMetricCard';
import type {
  ObservabilityApplicationPerformance,
  ObservabilityMetricStatus,
  ObservabilityStatusValue,
  ObservabilitySystemPerformance,
} from '@/types/observability.types';

type ObservabilityPerformancePanelProps = {
  systemPerformance: ObservabilitySystemPerformance | null;
  applicationPerformance: ObservabilityApplicationPerformance | null;
  metricStatus: ObservabilityMetricStatus | null;
  onRefresh?: () => void;
  loading?: boolean;
};

const buildSeries = (value: number, change: number) => {
  const base = value || 0;
  const start = base * (1 - (change / 100) * 0.5);
  const end = base;
  return [0, 1, 2, 3, 4, 5].map((t, idx, arr) => ({
    t,
    value: start + (end - start) * (idx / Math.max(1, arr.length - 1)),
  }));
};

const statusToBadgeVariant = (
  status: ObservabilityStatusValue | undefined,
): 'warning' | 'success' | 'info' | 'default' | 'error' => {
  if (!status) return 'default';
  if (status === 'success') return 'success';
  if (status === 'warning') return 'warning';
  if (status === 'error') return 'error';
  return 'info';
};

export default function ObservabilityPerformancePanel({ systemPerformance, applicationPerformance, metricStatus, onRefresh, loading }: ObservabilityPerformancePanelProps) {
  if (!systemPerformance && !applicationPerformance) {
    return null;
  }

  const { cpu_usage, memory_usage, disk_io, network } = systemPerformance ?? {
    cpu_usage: { value: 0, change: 0, status: 'info' },
    memory_usage: { value: 0, change: 0, status: 'info' },
    disk_io: { value: 0, change: 0, status: 'info' },
    network: { value: 0, change: 0, status: 'info' },
  };

  const app = applicationPerformance;
  const appStatus = metricStatus;

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
      <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 h-full group hover:shadow-md transition-shadow duration-300">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-left">
              <h4 className="text-lg">System Performance</h4>
              <p className="text-sm mt-1 text-gray-500">Real-time system metrics</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRefresh}
                disabled={loading}
              >
                <span className="sr-only">Refresh</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                >
                  <path
                    d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3v5h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 16H3v5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <ObservabilityMetricCard
            title="CPU Usage"
            subtitle={undefined}
            badgeLabel={cpu_usage.status}
            badgeVariant={cpu_usage.status === 'success' ? 'success' : cpu_usage.status === 'warning' ? 'warning' : 'info'}
            value={`${cpu_usage.value.toFixed(1)}%`}
            trendValue={`${Math.abs(cpu_usage.change).toFixed(1)}%`}
            trendDirection={cpu_usage.change >= 0 ? 'up' : 'down'}
            trendText="vs last period"
            data={buildSeries(cpu_usage.value, cpu_usage.change)}
            valueKey="value"
          />

          <ObservabilityMetricCard
            title="Memory Usage"
            subtitle={undefined}
            badgeLabel={memory_usage.status}
            badgeVariant={memory_usage.status === 'success' ? 'success' : memory_usage.status === 'warning' ? 'warning' : 'info'}
            value={`${memory_usage.value.toFixed(1)}%`}
            trendValue={`${Math.abs(memory_usage.change).toFixed(1)}%`}
            trendDirection={memory_usage.change >= 0 ? 'up' : 'down'}
            trendText="vs last period"
            data={buildSeries(memory_usage.value, memory_usage.change)}
            valueKey="value"
          />

          <ObservabilityMetricCard
            title="Disk I/O"
            subtitle={undefined}
            badgeLabel={disk_io.status}
            badgeVariant={disk_io.status === 'success' ? 'success' : disk_io.status === 'warning' ? 'warning' : 'info'}
            value={`${disk_io.value.toFixed(2)}MB/s`}
            trendValue={`${Math.abs(disk_io.change).toFixed(1)}%`}
            trendDirection={disk_io.change >= 0 ? 'up' : 'down'}
            trendText="vs last period"
            data={buildSeries(disk_io.value, disk_io.change)}
            valueKey="value"
          />

          <ObservabilityMetricCard
            title="Network"
            subtitle={undefined}
            badgeLabel={network.status}
            badgeVariant={network.status === 'success' ? 'success' : network.status === 'warning' ? 'warning' : 'info'}
            value={`${network.value.toFixed(2)}MBps`}
            trendValue={`${Math.abs(network.change).toFixed(1)}%`}
            trendDirection={network.change >= 0 ? 'up' : 'down'}
            trendText="vs last period"
            data={buildSeries(network.value, network.change)}
            valueKey="value"
          />
        </div>
      </div>

      <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 h-full group hover:shadow-md transition-all duration-300">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-left">
              <h4 className="text-lg">Application Performance</h4>
              <p className="text-sm mt-1 text-gray-500">API and service performance</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleRefresh}
                disabled={loading}
              >
                <span className="sr-only">Refresh</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                >
                  <path
                    d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 3v5h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 16H3v5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Application-level metrics could also be passed in via props and mapped here if desired */}
          {app && (
            <>
              <ObservabilityMetricCard
                title="Response Time"
                subtitle={undefined}
                badgeLabel={appStatus?.response_time}
                badgeVariant={statusToBadgeVariant(appStatus?.response_time)}
                value={`${app.response_time_ms}ms`}
                trendValue={app.response_time_ms.toFixed(0)}
                trendDirection="up"
                trendText="vs last period"
                data={buildSeries(app.response_time_ms, 0)}
                valueKey="value"
              />

              <ObservabilityMetricCard
                title="Throughput"
                subtitle={undefined}
                badgeLabel={appStatus?.throughput}
                badgeVariant={statusToBadgeVariant(appStatus?.throughput)}
                value={`${app.throughput_per_min.toFixed(2)}/min`}
                trendValue={app.throughput_per_min.toFixed(2)}
                trendDirection="up"
                trendText="vs last period"
                data={buildSeries(app.throughput_per_min, 0)}
                valueKey="value"
              />

              <ObservabilityMetricCard
                title="Error Rate"
                subtitle={undefined}
                badgeLabel={appStatus?.error_rate}
                badgeVariant={statusToBadgeVariant(appStatus?.error_rate)}
                value={`${app.error_rate_percent.toFixed(2)}%`}
                trendValue={app.error_rate_percent.toFixed(2)}
                trendDirection="up"
                trendText="vs last period"
                data={buildSeries(app.error_rate_percent, 0)}
                valueKey="value"
              />

              <ObservabilityMetricCard
                title="LLM Calls"
                subtitle={undefined}
                badgeLabel={appStatus?.llm_calls}
                badgeVariant={statusToBadgeVariant(appStatus?.llm_calls)}
                value={`${app.total_llm_calls}`}
                trendValue={app.total_llm_calls.toString()}
                trendDirection="up"
                trendText="vs last period"
                data={buildSeries(app.total_llm_calls, 0)}
                valueKey="value"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
