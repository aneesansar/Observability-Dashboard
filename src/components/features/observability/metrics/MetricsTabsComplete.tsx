import { useState } from 'react';
import { 
  ActivityIcon, 
  DatabaseIcon, 
  ChartColumnIcon, 
  CpuIcon, 
  ClockIcon, 
  FileTextIcon
} from 'lucide-react';
import { useMetrics } from '@/hooks/useMetrics';
import { formatShortNumber, formatBytes, formatDuration } from '@/utils/format';
import { 
  MetricCard,
  TabNavigation,
  StatsSummary,
  BarChartComponent,
  HttpRequestsSection,
  FunctionTable,
  ProcessMetrics
} from './components';

export default function MetricsTabsRefactored() {
  const [activeTab, setActiveTab] = useState('all');
  const { data, summary } = useMetrics();

  // Calculate derived metrics
  const totalRequests = summary?.request_metrics?.http_requests ?? 0;
  const totalFunctionCalls = data?.functions.functions.reduce((sum, func) => sum + func.calls, 0) || 0;
  const avgLatency = totalRequests > 0 && data?.latency.highResSum ? data.latency.highResSum / data.latency.highResCount : 0;
  const totalTime = data?.latency.highResSum || 0;
  const avgRequestSize = data?.transfer.handlers.length ? 
    data.transfer.handlers.reduce((sum, h) => sum + h.requestSumBytes, 0) / data.transfer.handlers.reduce((sum, h) => sum + h.requestCount, 0) : 0;
  const avgResponseSize = data?.transfer.handlers.length ? 
    data.transfer.handlers.reduce((sum, h) => sum + h.responseSumBytes, 0) / data.transfer.handlers.reduce((sum, h) => sum + h.responseCount, 0) : 0;

  // Prepare data for components
  const httpRequestsData = data?.http.handlers.length ? data.http.handlers : [];
  const statusCodesData = data?.http.status.length ? data.http.status.map(s => ({
    code: s.status,
    count: s.count,
    percentage: totalRequests > 0 ? ((s.count / totalRequests) * 100).toFixed(1) : '0'
  })) : [];
  const httpMethodsData = data?.http.methods.length ? data.http.methods.map(m => ({
    method: m.method,
    count: m.count
  })) : [];

  const tabs = [
    { id: 'all', name: 'All Metrics', icon: <ActivityIcon className="h-3 w-3" /> },
    { id: 'gc', name: 'Garbage Collection', icon: <DatabaseIcon className="h-3 w-3" /> },
    { id: 'http', name: 'HTTP Requests', icon: <ChartColumnIcon className="h-3 w-3" /> },
    { id: 'process', name: 'Process & Runtime', icon: <CpuIcon className="h-3 w-3" /> },
    { id: 'functions', name: 'Function Performance', icon: <ClockIcon className="h-3 w-3" /> },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Tab List */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 outline-none">
        {/* All Metrics Tab */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* HTTP & Performance Metrics */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <ChartColumnIcon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">HTTP & Performance Metrics</h3>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              
              <HttpRequestsSection
                totalRequests={totalRequests}
                httpRequestsData={httpRequestsData}
                statusCodesData={statusCodesData}
                httpMethodsData={httpMethodsData}
              />

              {/* Request Duration Histogram */}
              <MetricCard title="Request Duration Histogram" icon={<ClockIcon className="h-4 w-4 text-gray-400" />}>
                <StatsSummary
                  stats={[
                    { label: 'Avg Latency', value: formatDuration(avgLatency) },
                    { label: 'Total Requests', value: formatShortNumber(totalRequests) },
                    { label: 'Total Time', value: formatDuration(totalTime) }
                  ]}
                />
                <BarChartComponent 
                  data={data?.latency.highResBuckets || []}
                  dataKey="count"
                  xAxisDataKey="le"
                  height={200}
                  fill="#3b82f6"
                  angle={-45}
                />
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Latency Distribution</h4>
                  <div className="space-y-1">
                    {(data?.latency.highResBuckets || []).map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">≤{item.le}s</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.count}</span>
                          <span className="text-xs text-gray-500">
                            ({data?.latency.highResCount ? ((item.count / data.latency.highResCount) * 100).toFixed(1) : '0'}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </MetricCard>

              {/* Function Calls */}
              <MetricCard title="Function Calls" icon={<ClockIcon className="h-4 w-4 text-gray-400" />}>
                <StatsSummary
                  stats={[
                    { label: 'Total Functions', value: data?.functions.functions.length ?? 0 },
                    { label: 'Total Calls', value: formatShortNumber(totalFunctionCalls) }
                  ]}
                  columns={2}
                />
                <FunctionTable 
                  functions={data?.functions.functions || []}
                  totalFunctionCalls={totalFunctionCalls}
                  className="mt-4"
                />
              </MetricCard>

              {/* HTTP Transfer Sizes - Only show if there's transfer data */}
              {data?.transfer.handlers && data.transfer.handlers.length > 0 && (
                <MetricCard title="HTTP Transfer Sizes" icon={<FileTextIcon className="h-4 w-4 text-gray-400" />}>
                  <StatsSummary
                    stats={[
                      { label: 'Avg Request', value: formatBytes(avgRequestSize) },
                      { label: 'Avg Response', value: formatBytes(avgResponseSize) },
                      { label: 'Total Requests', value: formatShortNumber(totalRequests) }
                    ]}
                  />
                  <div className="w-full h-[200px] mt-4">
                    <BarChartComponent 
                      data={data?.transfer.handlers.map(h => ({
                        handler: h.handler,
                        avgRequest: formatBytes(h.requestCount > 0 ? h.requestSumBytes / h.requestCount : 0),
                        avgResponse: formatBytes(h.responseCount > 0 ? h.responseSumBytes / h.responseCount : 0),
                        requests: h.requestCount
                      })) || []}
                      dataKey="avgRequest"
                      xAxisDataKey="handler"
                      height={200}
                      fill="#3b82f6"
                      angle={-45}
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium">Handler Breakdown</h4>
                    <div className="space-y-1">
                      {data?.transfer.handlers.map((h, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs text-gray-700 bg-gray-100">
                              {h.handler}
                            </span>
                            <span className="text-gray-500">{h.requestCount} req</span>
                          </div>
                          <div className="flex gap-4 text-xs">
                            <span>↑ {formatBytes(h.requestCount > 0 ? h.requestSumBytes / h.requestCount : 0)}</span>
                            <span>↓ {formatBytes(h.responseCount > 0 ? h.responseSumBytes / h.responseCount : 0)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </MetricCard>
              )}

              {/* Process Metrics */}
              <ProcessMetrics summary={summary} />
            </div>
          </div>
        )}

        {/* HTTP Tab */}
        {activeTab === 'http' && (
          <div className="space-y-6">
            <HttpRequestsSection
              totalRequests={totalRequests}
              httpRequestsData={httpRequestsData}
              statusCodesData={statusCodesData}
              httpMethodsData={httpMethodsData}
            />
            
            {/* HTTP Transfer Sizes */}
            <MetricCard title="HTTP Transfer Sizes" icon={<FileTextIcon className="h-4 w-4 text-gray-400" />}>
              <StatsSummary
                stats={[
                  { label: 'Avg Request', value: formatBytes(avgRequestSize) },
                  { label: 'Avg Response', value: formatBytes(avgResponseSize) },
                  { label: 'Total Requests', value: formatShortNumber(totalRequests) }
                ]}
              />
            </MetricCard>
          </div>
        )}

        {/* Functions Tab */}
        {activeTab === 'functions' && (
          <div className="space-y-6">
            <MetricCard title="Function Calls" icon={<ClockIcon className="h-4 w-4 text-gray-400" />}>
              <StatsSummary
                stats={[
                  { label: 'Total Functions', value: data?.functions.functions.length ?? 0 },
                  { label: 'Total Calls', value: formatShortNumber(totalFunctionCalls) }
                ]}
                columns={2}
              />
              <FunctionTable 
                functions={data?.functions.functions || []}
                totalFunctionCalls={totalFunctionCalls}
                className="mt-4"
              />
            </MetricCard>
          </div>
        )}

        {/* GC Tab */}
        {activeTab === 'gc' && (
          <div className="space-y-6">
            <MetricCard title="GC Objects Collected" icon={<DatabaseIcon className="h-4 w-4 text-gray-400" />}>
              <BarChartComponent 
                data={data?.gc.collections || []}
                dataKey="count"
                xAxisDataKey="generation"
                height={200}
                fill="#3b82f6"
              />
            </MetricCard>
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div className="space-y-6">
            <ProcessMetrics summary={summary} />
          </div>
        )}
      </div>
    </div>
  );
}
