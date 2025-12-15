import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppLayout } from '@/components/Layout';
import PageTitle from '@/components/common/PageTitle';
import StatsCard from '@/components/common/StatsCard';
import { ArrowTrendingUpIcon, ExclamationTriangleIcon, ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { TracesFilter } from '@/components/features/observability/traces/TracesFilter';
import { SpanTimeline } from '@/components/features/observability/traces/SpanTimeline';
import { observabilityService } from '@/services/api';
import type { ObservabilityTrace } from '@/services/api/observability.service';

export default function TracesPage() {
  const [search, setSearch] = useState('');
  const [service, setService] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [minDuration, setMinDuration] = useState<number | undefined>(undefined);
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);

  const [activeView, setActiveView] = useState<'timeline' | 'table'>('timeline');

  const [traces, setTraces] = useState<ObservabilityTrace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalPages, setTotalPages] = useState(1);

  const loadTraces = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await observabilityService.getTraces({
          page: targetPage,
          limit,
          window_seconds: 0,
          max_spans: 2000,
        });
        setTraces(res.data || []);
        setTotalPages(res.total_pages || 1);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Failed to load traces:', err);
        setError(err?.message || 'Failed to load traces');
      } finally {
        setIsLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    void loadTraces(page);
  }, [page, loadTraces]);

  const filteredTraces = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return traces
      .map((trace) => {
        const filteredSpans = (trace.spans || []).filter((span) => {
          const spanName = span.name?.toLowerCase?.() ?? '';
          const traceId = trace.trace_id?.toLowerCase?.() ?? '';

          const matchesSearch =
            !searchValue ||
            spanName.includes(searchValue) ||
            traceId.includes(searchValue);

          const matchesStatus = !status || span.status === status;

          const attributes = span.attributes as Record<string, string> | undefined;
          const rawFunctionName =
            attributes?.['Developer.function.name'] ||
            attributes?.['function.name'];
          const classFromFunction = rawFunctionName
            ? rawFunctionName.split('.')[0]
            : undefined;
          const derivedServiceName =
            classFromFunction ||
            attributes?.['http.path'] ||
            attributes?.['service.name'];
          const matchesService = !service || derivedServiceName === service;

          const durationStr =
            (span.attributes as Record<string, string> | undefined)?.['Developer.function.duration'] ??
            (span.attributes as Record<string, string> | undefined)?.['function.duration'];
          const durationSeconds = durationStr ? Number.parseFloat(durationStr) : 0;
          const durationMs = Number.isFinite(durationSeconds) ? durationSeconds * 1000 : 0;

          const matchesMinDuration =
            minDuration === undefined || durationMs >= minDuration;
          const matchesMaxDuration =
            maxDuration === undefined || durationMs <= maxDuration;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesService &&
            matchesMinDuration &&
            matchesMaxDuration
          );
        });

        return {
          ...trace,
          spans: filteredSpans,
        };
      })
      .filter((trace) => (trace.spans || []).length > 0);
  }, [traces, search, service, status, minDuration, maxDuration]);

  const services = useMemo(() => {
    const values = new Set<string>();
    traces.forEach((trace) => {
      (trace.spans || []).forEach((span) => {
        const attributes = span.attributes as Record<string, string> | undefined;
        const rawFunctionName =
          attributes?.['Developer.function.name'] ||
          attributes?.['function.name'];
        const classFromFunction = rawFunctionName
          ? rawFunctionName.split('.')[0]
          : undefined;
        const derivedServiceName =
          classFromFunction ||
          attributes?.['http.path'] ||
          attributes?.['service.name'];
        if (derivedServiceName) {
          values.add(derivedServiceName);
        }
      });
    });
    return Array.from(values).sort();
  }, [traces]);

  const statuses = useMemo(() => {
    const values = new Set<string>();
    traces.forEach((trace) => {
      (trace.spans || []).forEach((span) => {
        if (span.status) {
          values.add(span.status);
        }
      });
    });
    return Array.from(values).sort();
  }, [traces]);

  return (
    <AppLayout padded={true}>
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between mt-1 mb-4">
          <PageTitle>Traces</PageTitle>
          <button
            type="button"
            onClick={() => void loadTraces(page)}
            disabled={isLoading}
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gradient-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Top stats, similar layout to Logs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Spans"
            subtitle="Across 1 trace"
            value="2"
            icon={<ArrowTrendingUpIcon className="h-4 w-4" />}
          />

          <StatsCard
            title="Error Rate"
            subtitle="0 error spans"
            value="0.0%"
            icon={<ExclamationTriangleIcon className="h-4 w-4" />}
          />

          <StatsCard
            title="Avg Duration"
            subtitle="Per span average"
            value="1.06s"
            icon={<ClockIcon className="h-4 w-4" />}
          />

          <StatsCard
            title="Services"
            subtitle="Unique services"
            value="2"
            icon={<Cog6ToothIcon className="h-4 w-4" />}
          />
        </div>

        {/* Traces filter */}
        <TracesFilter
          onSearchChange={setSearch}
          onServiceChange={setService}
          onStatusChange={setStatus}
          onMinDurationChange={setMinDuration}
          onMaxDurationChange={setMaxDuration}
          services={services}
          statuses={statuses}
        />

        {error && (
          <div className="mt-4 mb-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* View toggle - styled like MetricsTabs */}
        <div className="mt-6 mb-4 w-full max-w-sm">
          <div className="bg-gray-100 text-gray-600 h-9 items-center justify-center rounded-xl p-[3px] grid grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveView('timeline')}
              className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all flex items-center ${
                activeView === 'timeline'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Timeline
            </button>
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all flex items-center ${
                activeView === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {activeView === 'timeline' ? (
          <div className="space-y-4">
            <SpanTimeline traces={filteredTraces} loading={isLoading} />
            {traces.length === 0 && !isLoading && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mt-2 text-sm text-gray-600">
                No traces found for the current filters.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Traces Table</h2>
            <p className="text-gray-600 text-sm">
              A table view of traces and spans will be displayed here.
            </p>
          </div>
        )}

        {/* Pagination controls - styled like Table pagination */}
        <div className="mt-4 border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-charcoal hover:bg-gradient-brand hover:text-white disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-charcoal hover:bg-gradient-brand hover:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </p>
            </div>
            <div>
              <nav aria-label="Traces pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-charcoal inset-ring inset-ring-gray-300 hover:bg-gradient-brand hover:text-white focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  &lt;
                </button>
                {/* Show first page, previous, current, next, and last page with ellipses where needed */}
                {(() => {
                  const lastPage = Math.max(1, totalPages);
                  const pages = new Set<number>();

                  // Always show first and last
                  pages.add(1);
                  pages.add(lastPage);

                  // Previous, current, next
                  if (page > 1 && page - 1 > 1) pages.add(page - 1);
                  if (page >= 1 && page <= lastPage) pages.add(page);
                  if (page < lastPage && page + 1 < lastPage) pages.add(page + 1);

                  const ordered = Array.from(pages).sort((a, b) => a - b);

                  return (
                    <>
                      {ordered.map((p, idx) => {
                        const prev = ordered[idx - 1];
                        const showEllipsis = idx > 0 && p - prev > 1;

                        return (
                          <span key={p} className="inline-flex">
                            {showEllipsis && (
                              <span className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-400">
                                ...
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setPage(p)}
                              aria-current={page === p ? 'page' : undefined}
                              className={
                                page === p
                                  ? 'relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-charcoal inset-ring inset-ring-gray-300 hover:bg-gradient-brand hover:text-white focus:z-20 focus:outline-offset-0'
                              }
                            >
                              {p}
                            </button>
                          </span>
                        );
                      })}
                    </>
                  );
                })()}
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-charcoal inset-ring inset-ring-gray-300 hover:bg-gradient-brand hover:text-white focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
