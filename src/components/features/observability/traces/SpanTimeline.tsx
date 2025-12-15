import { useState } from 'react';
import { ClockIcon, ChevronRightIcon, ChevronDownIcon, CheckCircleIcon, XMarkIcon, TagIcon, ListBulletIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import type { ObservabilityTrace, ObservabilityTraceSpan } from '@/services/api/observability.service';

interface SpanItem {
  id: string;
  name: string;
  status: 'OK' | 'ERROR';
  durationMs: number;
  offsetMs: number;
  depth: number;
  attributes: Record<string, string>;
  events: ObservabilityTraceSpan['events'];
}

interface TraceItem {
  id: string;
  spanCount: number;
  totalDurationMs: number;
  spans: SpanItem[];
}

const mockTrace: TraceItem = {
  id: 'trace-001',
  spanCount: 3,
  totalDurationMs: 1270,
  spans: [
    {
      id: 'root',
      name: 'POST /api/users',
      status: 'OK',
      durationMs: 1270,
      offsetMs: 0,
      depth: 0,
      attributes: {},
      events: [],
    },
    {
      id: 'child-1',
      name: 'POST /api/payments',
      status: 'OK',
      durationMs: 232,
      offsetMs: 300,
      depth: 1,
      attributes: {},
      events: [],
    },
    {
      id: 'child-2',
      name: 'POST /api/users',
      status: 'OK',
      durationMs: 80,
      offsetMs: 600,
      depth: 1,
      attributes: {},
      events: [],
    },
  ],
};

interface SpanTimelineProps {
  traces: ObservabilityTrace[];
  loading?: boolean;
}

function mapApiTraceToInternal(apiTrace: ObservabilityTrace): TraceItem {
  const spans: SpanItem[] = [];

  const dfs = (span: ObservabilityTraceSpan, depth: number) => {
    const durationStr =
      span.attributes?.['Developer.function.duration'] ??
      span.attributes?.['function.duration'];
    const durationSeconds = durationStr ? Number.parseFloat(durationStr) : 0;
    const durationMs = Number.isFinite(durationSeconds) ? durationSeconds * 1000 : 0;

    spans.push({
      id: span.span_id,
      name: span.name,
      status: span.status === 'ERROR' ? 'ERROR' : 'OK',
      durationMs: durationMs || 100,
      offsetMs: 0,
      depth,
      attributes: (span.attributes ?? {}) as Record<string, string>,
      events: span.events ?? [],
    });

    (span.children || []).forEach((child) => dfs(child, depth + 1));
  };

  (apiTrace.spans || []).forEach((root) => dfs(root, 0));

  // Assign offsets sequentially so gaps reflect ordering
  let currentOffset = 0;
  const gapMs = 50;
  spans.forEach((s) => {
    s.offsetMs = currentOffset;
    currentOffset += s.durationMs + gapMs;
  });

  const totalDurationMs = spans.reduce(
    (max, s) => Math.max(max, s.offsetMs + s.durationMs),
    0,
  );

  return {
    id: apiTrace.trace_id,
    spanCount: spans.length,
    totalDurationMs: totalDurationMs || 1,
    spans,
  };
}

function getSortedSpansForTrace(traceItem: TraceItem): SpanItem[] {
  return [...traceItem.spans].sort((a, b) => a.offsetMs - b.offsetMs);
}

function getSpansWithLayout(
  traceItem: TraceItem,
  maxWidthPx: number,
  rowHeight: number,
  barHeight: number,
): Array<SpanItem & { width: number; left: number; top: number }> {
  const sortedSpans = getSortedSpansForTrace(traceItem);
  return sortedSpans.map((span, index) => {
    const totalMs = traceItem.totalDurationMs || 1;
    const width = (span.durationMs / totalMs) * maxWidthPx;
    const left = (span.offsetMs / totalMs) * maxWidthPx;
    const top = (rowHeight - barHeight) / 2 + index * rowHeight;
    return { ...span, width, left, top };
  });
}

export function SpanTimeline({ traces, loading }: SpanTimelineProps) {
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [selectedSpan, setSelectedSpan] = useState<SpanItem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'attributes' | 'events' | 'relations'>('overview');
  const [openAttributeKey, setOpenAttributeKey] = useState<string | null>(null);
  const traceItems: TraceItem[] =
    traces && traces.length > 0
      ? traces.map((t) => mapApiTraceToInternal(t))
      : [mockTrace];

  const activeIndex =
    traceItems.findIndex((t) => t.id === expandedTraceId) !== -1
      ? traceItems.findIndex((t) => t.id === expandedTraceId)
      : 0;

  const internalTrace = traceItems[activeIndex] ?? mockTrace;

  const totalDurationSeconds = (internalTrace.totalDurationMs / 1000).toFixed(2);
  const maxWidthPx = 520; // approximate width for bars
  const rowHeight = 32;   // height of each span row in the list
  const barHeight = 20;   // height of each timeline bar

  const formatDuration = (ms: number) =>
    ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms.toFixed(0)}ms`;

  const attributeEntries = selectedSpan
    ? Object.entries(selectedSpan.attributes ?? {})
    : [];

  const spanEvents = selectedSpan?.events ?? [];

  const activeTraceIdForDrawer = internalTrace.id;

  const formatEventTime = (ns: number) => {
    if (!ns) return '';
    const ms = ns / 1_000_000;
    return new Date(ms).toISOString();
  };

  return (
    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 pb-2">
        <h4 className="leading-none flex items-center gap-2 text-sm font-medium">
          <ClockIcon className="h-5 w-5" />
          Span Timeline
          <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0">
            {traceItems.reduce((sum, t) => sum + t.spanCount, 0)} spans
          </span>
        </h4>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Total Duration: {totalDurationSeconds}s</span>
            <span>{traceItems.length} traces</span>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-[400px] overflow-auto">
              {loading && (
                <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                  Loading traces...
                </div>
              )}
              {traceItems.map((traceItem) => (
                <div
                  key={traceItem.id}
                  className="border-b border-gray-200 last:border-b-0 overflow-y-hidden"
                >
                  {/* Trace row */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTraceId((prev) =>
                          prev === traceItem.id ? null : traceItem.id,
                        )
                      }
                      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 rounded-md h-6 w-6 p-0"
                    >
                      {expandedTraceId === traceItem.id ? (
                        <ChevronDownIcon className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="font-mono text-sm truncate">{traceItem.id}</span>
                      <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs">
                        {traceItem.spanCount} spans
                      </span>
                    </div>
                  </div>

                  {/* Expanded view with spans timeline for this trace */}
                  {expandedTraceId === traceItem.id && traceItem.spanCount > 0 && (
                    <div className="flex border-t border-gray-200">
                      {/* Span list */}
                      <div className="w-64 pl-2 shrink-0 border-r border-gray-200 bg-white">
                        {getSortedSpansForTrace(traceItem).map((span) => (
                          <div
                            key={span.id}
                            className="h-8 flex items-center gap-2 px-2 cursor-pointer hover:bg-gray-50"
                            style={{ paddingLeft: span.depth === 0 ? 0 : 16 }}
                            onClick={() => {
                              setSelectedSpan(span);
                            }}
                          >
                            <ClockIcon className="h-3 w-3 text-green-500" />
                            <span className="font-mono truncate text-xs sm:text-sm flex-1">
                              {span.name}
                            </span>
                            <span className="font-mono text-[10px] text-gray-500 whitespace-nowrap">
                              {formatDuration(span.durationMs)}
                            </span>
                            <CheckCircleIcon className="h-3 w-3 text-green-500" />
                          </div>
                        ))}
                      </div>

                      {/* Timeline bars */}
                      <div className="overflow-x-auto relative flex-1 bg-gray-50">
                        <div
                          className="relative"
                          style={{ width: maxWidthPx, height: rowHeight * getSortedSpansForTrace(traceItem).length }}
                        >
                          {getSpansWithLayout(traceItem, maxWidthPx, rowHeight, barHeight).map((span) => (
                            <div
                              key={span.id}
                              className="absolute rounded bg-primary opacity-80 hover:opacity-100 hover:ring-1 hover:ring-blue-500 flex items-center justify-center text-xs text-white font-medium"
                              style={{
                                top: span.top,
                                left: span.left,
                                width: span.width,
                                height: barHeight,
                              }}
                            >
                              {span.durationMs >= 100 && (
                                <span>
                                  {span.durationMs >= 1000
                                    ? `${(span.durationMs / 1000).toFixed(2)}s`
                                    : `${span.durationMs.toFixed(0)}ms`}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedSpan && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50 overflow-hidden flex flex-col">
          {/* Drawer header - aligned with Feedback toolbar style */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <ClockIcon className="h-5 w-5 text-green-500" />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold truncate text-sm sm:text-base text-gray-900">{selectedSpan?.name}</h2>
                <p className="text-xs text-gray-500 truncate">Span ID: {selectedSpan?.id}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSpan(null)}
              className="p-2 rounded-md border border-gray-300 bg-anti-flash-white text-charcoal hover:bg-gradient-brand hover:text-white transition-all"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Tabs + content */}
          <div className="flex-1 overflow-auto flex flex-col">
            {/* Tabs - aligned with MetricsTabs pill style */}
            <div className="h-9 flex items-center justify-center border-b border-gray-200 bg-gray-50 px-2 gap-1.5">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'attributes', label: 'Attributes' },
                { id: 'events', label: 'Events' },
                { id: 'relations', label: 'Relations' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 inline-flex items-center justify-center rounded-xl px-2.5 py-1 text-xs sm:text-sm font-medium border transition-all ${
                    activeTab === tab.id
                      ? 'bg-white border-gray-200 text-gray-900 shadow-sm'
                      : 'bg-transparent border-transparent text-gray-600 hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            <div className="flex-1 p-4 space-y-4 text-sm">
              {activeTab === 'overview' && (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium text-gray-900">Span Information</h4>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="px-6 pb-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <label className="font-medium text-gray-500">Status</label>
                          <div className="mt-1">
                            <span className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary text-white px-2 py-0.5 text-xs font-medium gap-1">
                              <CheckCircleIcon className="h-4 w-4" />
                              {selectedSpan?.status}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="font-medium text-gray-500">Kind</label>
                          <p className="mt-1 font-mono text-xs">server</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-500">Duration</label>
                          <p className="mt-1 font-mono text-xs">{formatDuration(selectedSpan?.durationMs ?? 0)}</p>
                        </div>
                        <div>
                          <label className="font-medium text-gray-500">Level</label>
                          <p className="mt-1 font-mono text-xs">{selectedSpan?.depth}</p>
                        </div>
                      </div>
                      <div className="h-px bg-gray-200" />
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-medium text-gray-500">Trace ID</label>
                          <div className="mt-1 flex items-center gap-2">
                            <code className="text-[11px] bg-gray-100 px-2 py-1 rounded flex-1 truncate">{activeTraceIdForDrawer}</code>
                          </div>
                        </div>
                        <div>
                          <label className="font-medium text-gray-500">Span ID</label>
                          <div className="mt-1 flex items-center gap-2">
                            <code className="text-[11px] bg-gray-100 px-2 py-1 rounded flex-1 truncate">{selectedSpan?.id}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium text-gray-900">Timing</h4>
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="px-6 pb-6 space-y-3 text-xs">
                      <div>
                        <label className="font-medium text-gray-500">Start Offset</label>
                        <p className="mt-1 font-mono">{`${(selectedSpan?.offsetMs ?? 0).toFixed(0)}ms from trace start`}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-500">Duration</label>
                        <p className="mt-1 font-mono">{formatDuration(selectedSpan?.durationMs ?? 0)}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'attributes' && (
                <div className="space-y-2 text-sm">
                  {attributeEntries.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-500 text-left">
                      No attributes for this span.
                    </div>
                  )}
                  {attributeEntries.map(([key, value]) => {
                    const isOpen = openAttributeKey === key;
                    return (
                      <div key={key} className="bg-white rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenAttributeKey((prev) => (prev === key ? null : key))
                          }
                          className="w-full flex items-center justify-between gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <TagIcon className="h-4 w-4" />
                            {key}
                          </span>
                          {isOpen ? (
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pt-1 pb-3 text-[13px] leading-snug text-gray-800 font-mono text-left break-all">
                            {value}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-3 text-sm">
                  {spanEvents.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 text-xs text-gray-500">
                      No events for this span.
                    </div>
                  )}
                  {spanEvents.map((event, idx) => {
                    const reasoningRaw = (event as any)['LLM.reasoning_step'] as string | null;
                    const reasoningText = reasoningRaw
                      ? reasoningRaw.split(':').slice(1).join(':').trim()
                      : '';

                    return (
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={idx}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col gap-3"
                      >
                        <div className="px-6 pt-6 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <ListBulletIcon className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{event.name}</span>
                          </div>
                          <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                            {event.time
                              ? new Date(event.time / 1_000_000).toLocaleTimeString()
                              : ''}
                          </span>
                        </div>
                        <div className="px-6 pb-6 space-y-2 text-xs text-gray-500 font-mono">
                          {event.time && <p>{formatEventTime(event.time)}</p>}
                          {reasoningText && (
                            <p className="text-[11px] text-gray-700 font-normal break-words">
                              {reasoningText}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'relations' && (
                <div className="space-y-4 text-sm">
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base flex items-center gap-2 text-gray-900">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        Parent Span
                      </h4>
                    </div>
                    <div className="px-6 pb-6">
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-3 w-3 text-green-500" />
                          <span className="font-mono text-sm">tenant_request</span>
                        </div>
                        <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                          100.0ms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base flex items-center gap-2 text-gray-900">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        Child Spans (1)
                      </h4>
                    </div>
                    <div className="px-6 pb-6 space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-3 w-3 text-green-500" />
                          <span className="font-mono text-sm truncate">KeycloakClient.decode_token</span>
                        </div>
                        <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                          100.0ms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base flex items-center gap-2 text-gray-900">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        Sibling Spans (2)
                      </h4>
                    </div>
                    <div className="px-6 pb-6 space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-3 w-3 text-green-500" />
                          <span className="font-mono text-sm truncate">InMemoryLogHandler.handle</span>
                        </div>
                        <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                          100.0ms
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-3 w-3 text-green-500" />
                          <span className="font-mono text-sm truncate">RAGPipeline.query</span>
                        </div>
                        <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                          100.0ms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
