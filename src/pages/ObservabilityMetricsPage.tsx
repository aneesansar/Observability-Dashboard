import { AppLayout } from '@/components/Layout';
import PageTitle from '@/components/common/PageTitle';
import MetricsOverview from '@/components/features/observability/metrics/MetricsOverview';
import MetricsTabsComplete from '@/components/features/observability/metrics/MetricsTabsComplete';
import { MetricsProvider, useMetricsContext } from '@/context/MetricsContext';

function MetricsContent() {
  const { refresh } = useMetricsContext();

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mt-1 mb-4">
        <PageTitle>Metrics</PageTitle>
        <button
          type="button"
          onClick={refresh}
          className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gradient-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Refresh
        </button>
      </div>
      
      <MetricsOverview />
      
      <div className="mt-6">
        <MetricsTabsComplete />
      </div>
    </div>
  );
}

export default function ObservabilityMetricsPage() {
  return (
    <AppLayout padded={true}>
      <MetricsProvider>
        <MetricsContent />
      </MetricsProvider>
    </AppLayout>
  );
}
