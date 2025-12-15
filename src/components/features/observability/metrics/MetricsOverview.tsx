import { ChartBarIcon, ClockIcon, ServerIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useMetrics } from '@/hooks/useMetrics';
import { formatShortNumber } from '@/utils/format';

interface MetricsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

function MetricsCard({ title, value, icon: Icon, badge }: MetricsCardProps) {
  return (
    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-rich-black">{value}</p>
          </div>
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        {badge && (
          <div className="mt-2">
            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 border-gray-300 bg-gray-100 text-gray-700">
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MetricsOverview() {
  const { data, summary, isLoading: _isLoading, error: _error } = useMetrics();

  // Compute real totals from backend metrics
  const totalHttpRequests = summary?.request_metrics?.http_requests?? 0;
  const totalFunctionCalls = data?.functions.functions.reduce((sum, fn) => sum + fn.calls, 0) ?? 0;
  const totalGcCollections = data?.gc.collections.reduce((sum, gc) => sum + gc.count, 0) ?? 0;

  // Determine if we have real data or are still using mock
  const hasRealData = !!data;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Total HTTP Requests"
        value={hasRealData ? formatShortNumber(totalHttpRequests) : '7.0B'}
        icon={ChartBarIcon}
      />
      <MetricsCard
        title="Function Calls"
        value={hasRealData ? formatShortNumber(totalFunctionCalls) : '3.5B'}
        icon={ClockIcon}
      />
      <MetricsCard
        title="GC Collections"
        value={hasRealData ? formatShortNumber(totalGcCollections) : '3.1K'}
        icon={ServerIcon}
      />
      <MetricsCard
        title="Data Source"
        value=""
        icon={BoltIcon}
        badge={hasRealData ? 'Live Data' : 'Mock Data'}
      />
    </div>
  );
}
