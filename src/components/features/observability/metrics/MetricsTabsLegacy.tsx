import { useState } from 'react';
import { 
  ActivityIcon, 
  DatabaseIcon, 
  ChartColumnIcon, 
  ChartPieIcon,
  CpuIcon, 
  ClockIcon, 
  GlobeIcon, 
  TrendingUpIcon, 
  FileTextIcon,
  CheckCircleIcon,
  UploadIcon,
  DownloadIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line, 
  Legend
} from 'recharts';
import { useMetrics } from '@/hooks/useMetrics';
import { formatShortNumber, formatBytes, formatDuration } from '@/utils/format';

export default function MetricsTabsComplete() {
  const [activeTab, setActiveTab] = useState('all');
  const [httpSubTab, setHttpSubTab] = useState('handlers');
  const { data, summary, isLoading: _isLoading, error: _error } = useMetrics();

  // Calculate derived metrics
  const totalRequests = data?.http.totalRequests || 0;
  const totalFunctionCalls = data?.functions.functions.reduce((sum, func) => sum + func.calls, 0) || 0;
  const avgLatency = totalRequests > 0 && data?.latency.highResSum ? data.latency.highResSum / data.latency.highResCount : 0;
  const totalTime = data?.latency.highResSum || 0;
  const avgRequestSize = data?.transfer.handlers.length ? 
    data.transfer.handlers.reduce((sum, h) => sum + h.requestSumBytes, 0) / data.transfer.handlers.reduce((sum, h) => sum + h.requestCount, 0) : 0;
  const avgResponseSize = data?.transfer.handlers.length ? 
    data.transfer.handlers.reduce((sum, h) => sum + h.responseSumBytes, 0) / data.transfer.handlers.reduce((sum, h) => sum + h.responseCount, 0) : 0;

  // Use real data when available, otherwise fall back to mock data
  const httpRequestsData = data?.http.handlers.length ? data.http.handlers : [
    { handler: 'none', requests: 8 },
    { handler: '/metrics', requests: 34 },
    { handler: '/traces', requests: 12 }
  ];

  const statusCodesData = data?.http.status.length ? data.http.status.map(s => ({
    code: s.status,
    count: s.count,
    percentage: data.http.totalRequests > 0 ? ((s.count / data.http.totalRequests) * 100).toFixed(1) : 0
  })) : [
    { code: '200', count: 45, percentage: 83.3 },
    { code: '404', count: 5, percentage: 9.3 },
    { code: '500', count: 3, percentage: 5.6 },
    { code: '301', count: 1, percentage: 1.8 }
  ];

  const httpMethodsData = data?.http.methods.length ? data.http.methods.map(m => ({
    method: m.method,
    count: m.count,
    percentage: data.http.totalRequests > 0 ? ((m.count / data.http.totalRequests) * 100).toFixed(1) : 0
  })) : [
    { method: 'GET', count: 40, percentage: 74.1 },
    { method: 'POST', count: 10, percentage: 18.5 },
    { method: 'PUT', count: 3, percentage: 5.6 },
    { method: 'DELETE', count: 1, percentage: 1.8 }
  ];

  const latencyHistogramData = data?.latency.highResBuckets.length ? data.latency.highResBuckets.map(b => ({
    range: `≤${b.le}s`,
    count: b.count,
    percentage: data.latency.highResCount > 0 ? ((b.count / data.latency.highResCount) * 100).toFixed(1) : 0
  })) : [
    { range: '≤0.01s', count: 46, percentage: 85.2 },
    { range: '≤0.025s', count: 53, percentage: 98.1 },
    { range: '≤0.05s', count: 53, percentage: 98.1 },
    { range: '≤0.075s', count: 54, percentage: 100.0 },
    { range: '≤0.1s', count: 54, percentage: 100.0 },
    { range: '≤0.25s', count: 54, percentage: 100.0 },
    { range: '≤0.5s', count: 54, percentage: 100.0 },
    { range: '≤0.75s', count: 54, percentage: 100.0 },
    { range: '≤1.0s', count: 54, percentage: 100.0 },
    { range: '≤1.5s', count: 54, percentage: 100.0 },
    { range: '≤2.0s', count: 54, percentage: 100.0 },
    { range: '≤2.5s', count: 54, percentage: 100.0 },
    { range: '≤3.0s', count: 54, percentage: 100.0 },
    { range: '≤3.5s', count: 54, percentage: 100.0 },
    { range: '≤4.0s', count: 54, percentage: 100.0 },
    { range: '≤4.5s', count: 54, percentage: 100.0 },
    { range: '≤5.0s', count: 54, percentage: 100.0 },
    { range: '≤7.5s', count: 54, percentage: 100.0 },
    { range: '≤10.0s', count: 54, percentage: 100.0 },
    { range: '≤30.0s', count: 54, percentage: 100.0 },
    { range: '≤60.0s', count: 54, percentage: 100.0 }
  ];

  const transferSizesData = data?.transfer.handlers.length ? data.transfer.handlers.map(h => ({
    handler: h.handler,
    avgRequest: formatBytes(h.requestCount > 0 ? h.requestSumBytes / h.requestCount : 0),
    avgResponse: formatBytes(h.responseCount > 0 ? h.responseSumBytes / h.responseCount : 0),
    requests: h.requestCount
  })) : [
    { handler: 'none', avgRequest: '4 B', avgResponse: '176 B', requests: 8 },
    { handler: '/metrics', avgRequest: '0 B', avgResponse: '359.42 KB', requests: 34 },
    { handler: '/traces', avgRequest: '0 B', avgResponse: '934.91 KB', requests: 12 }
  ];

  const COLORS = {
    blue: '#3b82f6',
    green: '#34C759',
    orange: '#f97316',
    red: '#ef4444',
    purple: '#7c26a6',
    gray: '#6b7280'
  };

  const gcCollectionsData = data?.gc.collections.length ? data.gc.collections.map(g => ({
    generation: `Gen ${g.generation}`,
    count: g.count
  })) : [
    { generation: 'Gen 0', count: 2791 },
    { generation: 'Gen 1', count: 253 },
    { generation: 'Gen 2', count: 13 }
  ];

  // Note: GC time series data is not available from backend metrics
  // This remains mock data as backend only provides counters, not time series
  const gcTimeSeriesData = [
    { time: '01:06', gen0: 2800, gen1: 2, gen2: 0 },
    { time: '01:11', gen0: 2750, gen1: 2, gen2: 0 },
    { time: '01:16', gen0: 2780, gen1: 2, gen2: 0 },
    { time: '01:21', gen0: 2820, gen1: 3, gen2: 0 },
    { time: '01:26', gen0: 2760, gen1: 2, gen2: 0 },
    { time: '01:31', gen0: 2740, gen1: 2, gen2: 0 },
    { time: '01:36', gen0: 2810, gen1: 2, gen2: 0 },
    { time: '01:41', gen0: 2770, gen1: 3, gen2: 0 },
    { time: '01:46', gen0: 2750, gen1: 2, gen2: 0 },
    { time: '01:51', gen0: 2790, gen1: 2, gen2: 0 }
  ];

  // Calculate derived metrics
  const avgLatencyMs = data?.latency.highResCount && data.latency.highResCount > 0 
    ? (data.latency.highResSum / data.latency.highResCount) * 1000 
    : 5.6;

  const tabs = [
    { id: 'all', name: 'All Metrics', icon: ActivityIcon },
    { id: 'gc', name: 'Garbage Collection', icon: DatabaseIcon },
    { id: 'http', name: 'HTTP Requests', icon: ChartColumnIcon },
    { id: 'process', name: 'Process & Runtime', icon: CpuIcon },
    { id: 'functions', name: 'Function Performance', icon: ClockIcon },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Tab List */}
      <div className="bg-gray-100 text-gray-600 h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]
                flex items-center space-x-2
                ${isActive 
                  ? 'bg-white text-gray-900 border-transparent' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 outline-none space-y-6">
        {activeTab === 'all' && (
          <div className="flex-1 outline-none space-y-6">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-6 scroll-smooth">
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column h-4 w-4 text-primary">
                    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                    <path d="M18 17V9"></path>
                    <path d="M13 17V5"></path>
                    <path d="M8 17v-3"></path>
                  </svg>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">HTTP &amp; Performance Metrics</h3>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                <div className="w-full">
                  <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">HTTP Requests</h4>
                      <GlobeIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="px-6 pb-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatShortNumber(totalRequests)}</div>
                          <div className="text-sm text-gray-500">Total Requests</div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="bg-gray-100 text-gray-600 h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-3">
                            <button 
                              onClick={() => setHttpSubTab('handlers')}
                              className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap flex items-center space-x-1 ${
                                httpSubTab === 'handlers' 
                                  ? 'bg-white text-gray-900' 
                                  : 'text-gray-600'
                              }`}
                            >
                              <ChartColumnIcon className="h-3 w-3" />
                              <span className="text-xs">Handlers</span>
                            </button>
                            <button 
                              onClick={() => setHttpSubTab('status')}
                              className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap flex items-center space-x-1 ${
                                httpSubTab === 'status' 
                                  ? 'bg-white text-gray-900' 
                                  : 'text-gray-600'
                              }`}
                            >
                              <ChartPieIcon className="h-3 w-3" />
                              <span className="text-xs">Status</span>
                            </button>
                            <button 
                              onClick={() => setHttpSubTab('methods')}
                              className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap flex items-center space-x-1 ${
                                httpSubTab === 'methods' 
                                  ? 'bg-white text-gray-900' 
                                  : 'text-gray-600'
                              }`}
                            >
                              <ChartColumnIcon className="h-3 w-3" />
                              <span className="text-xs">Methods</span>
                            </button>
                          </div>
                          
                          <div className="flex-1 outline-none">
                            {httpSubTab === 'handlers' && (
                              <div className="w-full h-[150px]">
                                <ResponsiveContainer width="100%" height={150}>
                                  <BarChart data={httpRequestsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      dataKey="handler" 
                                      tick={{ fontSize: 10 }}
                                      angle={-45}
                                      textAnchor="end"
                                      height={60}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="requests" fill={COLORS.blue} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                            
                            {httpSubTab === 'status' && (
                              <div className="w-full h-[150px] flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height={120}>
                                  <PieChart>
                                    <Pie
                                      data={statusCodesData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={30}
                                      outerRadius={50}
                                      paddingAngle={2}
                                      dataKey="count"
                                    >
                                      <Cell fill={COLORS.purple} />
                                      <Cell fill={COLORS.blue} />
                                      <Cell fill={COLORS.gray} />
                                      <Cell fill={COLORS.gray} />
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                                {/* Legend */}
                                <div className="flex justify-center gap-4 text-xs mt-2">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-purple-600 rounded"></div>
                                    <span>2xx</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-600 rounded"></div>
                                    <span>4xx</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded"></div>
                                    <span>Other</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {httpSubTab === 'methods' && (
                              <div className="w-full h-[150px]">
                                <ResponsiveContainer width="100%" height={150}>
                                  <BarChart data={httpMethodsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      dataKey="method" 
                                      tick={{ fontSize: 10 }}
                                      angle={-45}
                                      textAnchor="end"
                                      height={60}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill={COLORS.green} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">Request Duration Histogram</h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-4 w-4 text-muted-foreground">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div className="px-6 [&amp;:last-child]:pb-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-semibold">{formatDuration(avgLatencyMs / 1000)}</div>
                            <div className="text-xs text-muted-foreground">Avg Latency</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{totalRequests}</div>
                            <div className="text-xs text-muted-foreground">Total Requests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{formatDuration(totalTime)}</div>
                            <div className="text-xs text-muted-foreground">Total Time</div>
                          </div>
                        </div>
                        <div className="w-full h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={latencyHistogramData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="range" 
                                angle={-45} 
                                textAnchor="end" 
                                height={60} 
                                className="text-xs fill-muted-foreground"
                              />
                              <YAxis className="text-xs fill-muted-foreground" />
                              <Tooltip />
                              <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Latency Distribution</h4>
                          <div className="space-y-1">
                            {latencyHistogramData.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{item.range}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{item.count}</span>
                                  <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">Function Calls</h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code h-4 w-4 text-muted-foreground">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                    </div>
                    <div className="px-6 [&amp;:last-child]:pb-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Total Functions: {data?.functions.functions.length ?? 4}</span>
                          <span className="text-muted-foreground">Total Calls: {formatShortNumber(data?.functions.functions.reduce((sum, fn) => sum + fn.calls, 0) ?? 3514700000)}</span>
                        </div>
                        <div className="rounded-md border max-h-64 overflow-auto">
                          <div className="relative w-full overflow-x-auto">
                            <table className="w-full caption-bottom text-sm">
                              <thead className="[&amp;_tr]:border-b">
                                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50">
                                    <div className="flex items-center space-x-1">
                                      <span>Function</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down h-3 w-3">
                                        <path d="m21 16-4 4-4-4"></path>
                                        <path d="M17 20V4"></path>
                                        <path d="m3 8 4-4 4 4"></path>
                                        <path d="M7 4v16"></path>
                                      </svg>
                                    </div>
                                  </th>
                                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50">
                                    <div className="flex items-center space-x-1">
                                      <span>Calls</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down h-3 w-3">
                                        <path d="m21 16-4 4-4-4"></path>
                                        <path d="M17 20V4"></path>
                                        <path d="m3 8 4-4 4 4"></path>
                                        <path d="M7 4v16"></path>
                                      </svg>
                                    </div>
                                  </th>
                                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50">
                                    <div className="flex items-center space-x-1">
                                      <span>Avg Duration</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down h-3 w-3">
                                        <path d="m21 16-4 4-4-4"></path>
                                        <path d="M17 20V4"></path>
                                        <path d="m3 8 4-4 4 4"></path>
                                        <path d="M7 4v16"></path>
                                      </svg>
                                    </div>
                                  </th>
                                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-muted/50">
                                    <div className="flex items-center space-x-1">
                                      <span>Total Duration</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down h-3 w-3">
                                        <path d="m21 16-4 4-4-4"></path>
                                        <path d="M17 20V4"></path>
                                        <path d="m3 8 4-4 4 4"></path>
                                        <path d="M7 4v16"></path>
                                      </svg>
                                    </div>
                                  </th>
                                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">%</th>
                                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Impact</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                  <td className="p-2 align-middle font-mono text-xs">log_and_time</td>
                                  <td className="p-2 align-middle font-mono text-xs">1757.3M</td>
                                  <td className="p-2 align-middle font-mono text-xs">0.08ms</td>
                                  <td className="p-2 align-middle font-mono text-xs">0.08ms</td>
                                  <td className="p-2 align-middle font-mono text-xs">50.0%</td>
                                  <td className="p-2 align-middle">
                                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-red-100 text-red-800">High</span>
                                  </td>
                                </tr>
                                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                  <td className="p-2 align-middle font-mono text-xs">defined_properties</td>
                                  <td className="p-2 align-middle font-mono text-xs">1757.3M</td>
                                  <td className="p-2 align-middle font-mono text-xs">0.17ms</td>
                                  <td className="p-2 align-middle font-mono text-xs">6.99ms</td>
                                  <td className="p-2 align-middle font-mono text-xs">50.0%</td>
                                  <td className="p-2 align-middle">
                                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-red-100 text-red-800">High</span>
                                  </td>
                                </tr>
                                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                  <td className="p-2 align-middle font-mono text-xs">defined_properties</td>
                                  <td className="p-2 align-middle font-mono text-xs">41</td>
                                  <td className="p-2 align-middle font-mono text-xs">0.17ms</td>
                                  <td className="p-2 align-middle font-mono text-xs">6.99ms</td>
                                  <td className="p-2 align-middle font-mono text-xs">0.0%</td>
                                  <td className="p-2 align-middle">
                                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-green-100 text-green-800">Low</span>
                                  </td>
                                </tr>
                                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                  <td className="p-2 align-middle font-mono text-xs">log_and_time</td>
                                  <td className="p-2 align-middle font-mono text-xs">1</td>
                                  <td className="p-2 align-middle font-mono text-xs">0.08ms</td>
                                  <td className="p-2 align-middle font-mono text-xs">0.08ms</td>
                                  <td className="p-2 align-middle font-mono text-xs">0.0%</td>
                                  <td className="p-2 align-middle">
                                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-green-100 text-green-800">Low</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-h-[400px] w-full">
                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">GC Collections</h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-4 w-4 text-muted-foreground">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                        <polyline points="16 7 22 7 22 13"></polyline>
                      </svg>
                    </div>
                    <div className="px-6 [&amp;:last-child]:pb-6">
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {gcCollectionsData.map((gc, index) => (
                          <div key={index} className="text-center">
                            <div className="text-lg font-semibold">{gc.count}</div>
                            <div className="text-xs text-muted-foreground">{gc.generation}</div>
                          </div>
                        ))}
                      </div>
                      <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={gcTimeSeriesData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
                            <YAxis className="text-xs fill-muted-foreground" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="gen0" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} name="Generation 0" />
                            <Line type="monotone" dataKey="gen1" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} name="Generation 1" />
                            <Line type="monotone" dataKey="gen2" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} name="Generation 2" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-h-[400px] w-full">
                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">HTTP Transfer Sizes</h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-4 w-4 text-muted-foreground">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                      </svg>
                    </div>
                    <div className="px-6 [&amp;:last-child]:pb-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold">{formatBytes(avgRequestSize)}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload h-3 w-3">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" x2="12" y1="3" y2="15"></line>
                              </svg>
                              Avg Request
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{formatBytes(avgResponseSize)}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download h-3 w-3">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" x2="12" y1="15" y2="3"></line>
                              </svg>
                              Avg Response
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{totalRequests}</div>
                            <div className="text-xs text-muted-foreground">Total Requests</div>
                          </div>
                        </div>
                        <div className="w-full h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={transferSizesData}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis dataKey="handler" angle={-45} textAnchor="end" height={60} className="text-xs fill-muted-foreground" />
                              <YAxis className="text-xs fill-muted-foreground" />
                              <Tooltip />
                              <Bar dataKey="avgRequest" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                              <Bar dataKey="avgResponse" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                              <Legend />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Handler Breakdown</h4>
                          <div className="space-y-1">
                            {transferSizesData.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs">
                                    {item.handler}
                                  </span>
                                  <span className="text-muted-foreground">{item.requests} req</span>
                                </div>
                                <div className="flex gap-4 text-xs">
                                  <span>↑ {item.avgRequest}</span>
                                  <span>↓ {item.avgResponse}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Content length of incoming requests by handler. Only value of header is respected. Otherwise ignored. No percentile calculated. 
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-h-[400px] w-full">
                  <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">Process Metrics</h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu h-4 w-4 text-muted-foreground">
                        <rect width="16" height="16" x="4" y="4" rx="2"></rect>
                        <rect width="6" height="6" x="9" y="9" rx="1"></rect>
                        <path d="M15 2v2"></path>
                        <path d="M15 20v2"></path>
                        <path d="M2 15h2"></path>
                        <path d="M2 9h2"></path>
                        <path d="M20 15h2"></path>
                        <path d="M20 9h2"></path>
                        <path d="M9 2v2"></path>
                        <path d="M9 20v2"></path>
                      </svg>
                    </div>
                    <div className="px-6 [&amp;:last-child]:pb-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu h-4 w-4 text-muted-foreground">
                            <rect width="16" height="16" x="4" y="4" rx="2"></rect>
                            <rect width="6" height="6" x="9" y="9" rx="1"></rect>
                            <path d="M15 2v2"></path>
                            <path d="M15 20v2"></path>
                            <path d="M2 15h2"></path>
                            <path d="M2 9h2"></path>
                            <path d="M20 15h2"></path>
                            <path d="M20 9h2"></path>
                            <path d="M9 2v2"></path>
                            <path d="M9 20v2"></path>
                          </svg>
                          <span className="text-sm font-medium">Runtime Environment</span>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Python Version</div>
                          <div className="font-semibold">{summary?.runtime_environment.python_version ?? 'CPython 3.9.6'}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Health</span>
                        <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-transparent text-primary-foreground ${
                          summary?.system_health.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {summary?.system_health.status ?? 'Healthy'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hard-drive h-4 w-4 text-muted-foreground">
                            <line x1="22" x2="2" y1="12" y2="12"></line>
                            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                            <line x1="6" x2="6.01" y1="16" y2="16"></line>
                            <line x1="10" x2="10.01" y1="16" y2="16"></line>
                          </svg>
                          <span className="text-sm font-medium">Memory Usage</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Virtual</div>
                            <div className="font-semibold">{summary?.memory_usage.virtual.formatted.used ?? '0 B'}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Resident</div>
                            <div className="font-semibold">{summary?.memory_usage.resident.formatted.rss ?? '0 B'}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Memory Efficiency</span>
                            <span>{summary?.memory_usage.memory_efficiency?.toFixed(1) ?? '0.0'}%</span>
                          </div>
                          <div className="bg-primary/20 relative w-full overflow-hidden rounded-full h-2">
                            <div className="bg-primary h-full flex-1 transition-all" style={{ transform: `translateX(-${100 - (summary?.memory_usage.memory_efficiency ?? 0)}%)` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-4 w-4 text-muted-foreground">
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                            <path d="M10 9H8"></path>
                            <path d="M16 13H8"></path>
                            <path d="M16 17H8"></path>
                          </svg>
                          <span className="text-sm font-medium">File Descriptors</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{summary?.file_descriptors.open ?? 0} / {summary?.file_descriptors.max ?? 0} open</span>
                          <span>{summary?.file_descriptors.percentage?.toFixed(1) ?? '0.0'}%</span>
                        </div>
                        <div className="bg-primary/20 relative w-full overflow-hidden rounded-full h-2">
                          <div className="bg-primary h-full flex-1 transition-all" style={{ transform: `translateX(-${100 - (summary?.file_descriptors.percentage ?? 0)}%)` }}></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu h-3 w-3 text-muted-foreground">
                              <rect width="16" height="16" x="4" y="4" rx="2"></rect>
                              <rect width="6" height="6" x="9" y="9" rx="1"></rect>
                              <path d="M15 2v2"></path>
                              <path d="M15 20v2"></path>
                              <path d="M2 15h2"></path>
                              <path d="M2 9h2"></path>
                              <path d="M20 15h2"></path>
                              <path d="M20 9h2"></path>
                              <path d="M9 2v2"></path>
                              <path d="M9 20v2"></path>
                            </svg>
                            <span className="text-sm text-muted-foreground">CPU Time</span>
                          </div>
                          <div className="font-semibold">{summary?.cpu_time.total_cpu_time?.toFixed(2) ?? '0.00'}s</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-3 w-3 text-muted-foreground">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span className="text-sm text-muted-foreground">Uptime</span>
                          </div>
                          <div className="font-semibold">{summary?.system_health.uptime_formatted ?? 'Unknown'}</div>
                        </div>
                      </div>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Raw Values</summary>
                        <div className="mt-2 space-y-1 font-mono bg-muted/50 p-2 rounded">
                          <div>Virtual Memory: {summary?.memory_usage.virtual.total.toLocaleString() ?? '0'} bytes</div>
                          <div>Resident Memory: {summary?.memory_usage.resident.rss.toLocaleString() ?? '0'} bytes</div>
                          <div>CPU Seconds: {summary?.cpu_time.total_cpu_time?.toFixed(2) ?? '0'}</div>
                          <div>Start Time: {summary?.timestamp ? new Date(summary.timestamp * 1000).toLocaleString() : '01/01/1970, 01:00:00'}</div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity h-4 w-4 text-primary">
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                  </svg>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Additional Metrics</h3>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className="min-h-[350px] w-full">
                    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                        <h4 className="text-base font-medium">Uncollectable Objects</h4>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-4 w-4 text-green-500">
                          <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                          <path d="m9 11 3 3L22 4"></path>
                        </svg>
                      </div>
                      <div className="px-6 [&amp;:last-child]:pb-6">
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold">0</div>
                            <p className="text-sm text-muted-foreground">Total Uncollectable</p>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-transparent text-primary-foreground bg-green-500">Healthy</span>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">By Generation</h4>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Generation 0</span>
                              <span className="text-sm font-medium">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Generation 1</span>
                              <span className="text-sm font-medium">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Generation 2</span>
                              <span className="text-sm font-medium">0</span>
                            </div>
                          </div>
                          <div className="mt-4 p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center space-x-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-4 w-4 text-green-500">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                              <span className="text-sm text-green-700 dark:text-green-300">No memory leaks detected</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GC Tab */}
        {activeTab === 'gc' && (
          <div className="flex-1 outline-none space-y-6">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-6 scroll-smooth">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* GC Objects Collected Card */}
                  <div className="min-h-[400px] w-full">
                    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                        <h4 className="text-base font-medium">GC Objects Collected</h4>
                        <DatabaseIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="px-6 pb-6">
                        <div className="w-full h-[200px] flex items-end justify-between gap-2 px-2">
                          {gcCollectionsData.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className={`w-full rounded-t-sm transition-all duration-300 hover:opacity-80 ${
                                  item.generation === 'Gen 0' ? 'bg-blue-500' : 
                                  item.generation === 'Gen 1' ? 'bg-green-500' : 'bg-orange-500'
                                }`}
                                style={{ 
                                  height: `${item.count > 0 ? (item.count / 2791) * 160 : 0}px`,
                                  minHeight: '2px'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                          {gcCollectionsData.map((item, index) => (
                            <span key={index}>{item.generation}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GC Collections Over Time Card */}
                  <div className="min-h-[400px] w-full">
                    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                        <h4 className="text-base font-medium">GC Collections Over Time</h4>
                        <TrendingUpIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="px-6 pb-6">
                        <div className="w-full h-[200px] relative">
                          <div className="absolute inset-0 flex items-end justify-between gap-2 px-2">
                            {gcTimeSeriesData.map((item, index) => (
                              <div key={index} className="flex-1 flex flex-col items-center justify-end relative">
                                <div
                                  className="w-2 h-2 bg-blue-500 rounded-full absolute"
                                  style={{ 
                                    bottom: `${(item.gen0 / 3000) * 142}px`,
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                  }}
                                />
                                <div
                                  className="w-2 h-2 bg-green-500 rounded-full absolute"
                                  style={{ 
                                    bottom: `${(item.gen1 / 3000) * 142}px`,
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                  }}
                                />
                                <div
                                  className="w-2 h-2 bg-orange-500 rounded-full absolute"
                                  style={{ 
                                    bottom: `${(item.gen2 / 3000) * 142}px`,
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uncollectable Objects Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className="min-h-[350px] w-full">
                    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                        <h4 className="text-base font-medium">Uncollectable Objects</h4>
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="px-6 pb-6">
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold">0</div>
                            <p className="text-sm text-gray-500">Total Uncollectable</p>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 border-transparent text-white bg-green-500">
                              Healthy
                            </span>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">By Generation</h4>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Generation 0</span>
                              <span className="text-sm font-medium">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Generation 1</span>
                              <span className="text-sm font-medium">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Generation 2</span>
                              <span className="text-sm font-medium">0</span>
                            </div>
                          </div>
                          <div className="mt-4 p-3 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-700">No memory leaks detected</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HTTP Tab */}
        {activeTab === 'http' && (
          <div className="flex-1 outline-none space-y-6">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-6 scroll-smooth">
              <div className="space-y-6">
                <div className="w-full">
                  <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">HTTP Requests</h4>
                      <GlobeIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="px-6 pb-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">7.0B</div>
                          <div className="text-sm text-gray-500">Total Requests</div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="bg-gray-100 text-gray-600 h-9 items-center justify-center rounded-xl p-[3px] grid w-full grid-cols-3">
                            <button 
                              onClick={() => setHttpSubTab('handlers')}
                              className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap flex items-center space-x-1 ${
                                httpSubTab === 'handlers' 
                                  ? 'bg-white text-gray-900' 
                                  : 'text-gray-600'
                              }`}
                            >
                              <ChartColumnIcon className="h-3 w-3" />
                              <span className="text-xs">Handlers</span>
                            </button>
                            <button 
                              onClick={() => setHttpSubTab('status')}
                              className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap flex items-center space-x-1 ${
                                httpSubTab === 'status' 
                                  ? 'bg-white text-gray-900' 
                                  : 'text-gray-600'
                              }`}
                            >
                              <ChartPieIcon className="h-3 w-3" />
                              <span className="text-xs">Status</span>
                            </button>
                            <button 
                              onClick={() => setHttpSubTab('methods')}
                              className={`h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap flex items-center space-x-1 ${
                                httpSubTab === 'methods' 
                                  ? 'bg-white text-gray-900' 
                                  : 'text-gray-600'
                              }`}
                            >
                              <ChartColumnIcon className="h-3 w-3" />
                              <span className="text-xs">Methods</span>
                            </button>
                          </div>
                          
                          <div className="flex-1 outline-none">
                            {httpSubTab === 'handlers' && (
                              <div className="w-full h-[150px]">
                                <ResponsiveContainer width="100%" height={150}>
                                  <BarChart data={httpRequestsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      dataKey="handler" 
                                      tick={{ fontSize: 10 }}
                                      angle={-45}
                                      textAnchor="end"
                                      height={60}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="requests" fill={COLORS.blue} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                            
                            {httpSubTab === 'status' && (
                              <div className="w-full h-[150px] flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height={120}>
                                  <PieChart>
                                    <Pie
                                      data={statusCodesData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={30}
                                      outerRadius={50}
                                      paddingAngle={2}
                                      dataKey="count"
                                    >
                                      <Cell fill={COLORS.purple} />
                                      <Cell fill={COLORS.blue} />
                                      <Cell fill={COLORS.gray} />
                                      <Cell fill={COLORS.gray} />
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                                {/* Legend */}
                                <div className="flex justify-center gap-4 text-xs mt-2">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-purple-600 rounded"></div>
                                    <span>2xx</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-600 rounded"></div>
                                    <span>4xx</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded"></div>
                                    <span>Other</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {httpSubTab === 'methods' && (
                              <div className="w-full h-[150px]">
                                <ResponsiveContainer width="100%" height={150}>
                                  <BarChart data={httpMethodsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      dataKey="method" 
                                      tick={{ fontSize: 10 }}
                                      angle={-45}
                                      textAnchor="end"
                                      height={60}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill={COLORS.green} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">Request Duration Histogram</h4>
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="px-6 pb-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{formatDuration(avgLatency)}</div>
                            <div className="text-sm text-gray-500">Avg Latency</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{formatShortNumber(totalRequests)}</div>
                            <div className="text-sm text-gray-500">Total Requests</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{formatDuration(totalTime)}</div>
                            <div className="text-xs text-gray-500">Total Time</div>
                          </div>
                        </div>
                        <div className="w-full h-[200px] relative">
                          <div className="absolute inset-0 flex items-end justify-between gap-1 px-2">
                            {[
                              { range: '≤0.01s', count: 46 },
                              { range: '≤0.05s', count: 53 },
                              { range: '≤0.1s', count: 54 },
                              { range: '≤0.5s', count: 54 },
                              { range: '≤1.0s', count: 54 },
                              { range: '≤2.0s', count: 54 },
                              { range: '≤3.0s', count: 54 },
                              { range: '≤4.0s', count: 54 },
                              { range: '≤5.0s', count: 54 },
                              { range: '≤10.0s', count: 54 },
                              { range: '≤60.0s', count: 54 }
                            ].map((item, index) => (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div 
                                  className="w-full bg-blue-400 rounded-t-sm transition-all duration-300 hover:bg-blue-500"
                                  style={{ 
                                    height: `${(item.count / 60) * 160}px`,
                                    minHeight: '2px'
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                            {['≤0.01s', '≤0.05s', '≤0.1s', '≤0.5s', '≤1.0s', '≤2.0s', '≤3.0s', '≤4.0s', '≤5.0s', '≤10.0s', '≤60.0s'].map((label, index) => (
                              <span key={index} className="text-xs transform -rotate-45 origin-left">{label}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Latency Distribution</h4>
                          <div className="space-y-1">
                            {[
                              { range: '≤0.01s', count: 46, percentage: 85.2 },
                              { range: '≤0.025s', count: 53, percentage: 98.1 },
                              { range: '≤0.05s', count: 53, percentage: 98.1 },
                              { range: '≤0.075s', count: 54, percentage: 100.0 },
                              { range: '≤0.1s', count: 54, percentage: 100.0 },
                              { range: '≤0.25s', count: 54, percentage: 100.0 },
                              { range: '≤0.5s', count: 54, percentage: 100.0 },
                              { range: '≤0.75s', count: 54, percentage: 100.0 },
                              { range: '≤1.0s', count: 54, percentage: 100.0 },
                              { range: '≤1.5s', count: 54, percentage: 100.0 },
                              { range: '≤2.0s', count: 54, percentage: 100.0 },
                              { range: '≤2.5s', count: 54, percentage: 100.0 },
                              { range: '≤3.0s', count: 54, percentage: 100.0 },
                              { range: '≤3.5s', count: 54, percentage: 100.0 },
                              { range: '≤4.0s', count: 54, percentage: 100.0 },
                              { range: '≤4.5s', count: 54, percentage: 100.0 },
                              { range: '≤5.0s', count: 54, percentage: 100.0 },
                              { range: '≤7.5s', count: 54, percentage: 100.0 },
                              { range: '≤10.0s', count: 54, percentage: 100.0 },
                              { range: '≤30.0s', count: 54, percentage: 100.0 },
                              { range: '≤60.0s', count: 54, percentage: 100.0 }
                            ].map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">{item.range}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{item.count}</span>
                                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                          Latency with many buckets but no API specific labels. Made for more accurate percentile calculations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="min-h-[400px] w-full">
                      <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                          <h4 className="text-base font-medium">HTTP Transfer Sizes</h4>
                          <FileTextIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="px-6 pb-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold">{formatBytes(avgRequestSize)}</div>
                                <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                  <UploadIcon className="h-3 w-3" />
                                  Avg Request
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold">{formatBytes(avgResponseSize)}</div>
                                <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                  <DownloadIcon className="h-3 w-3" />
                                  Avg Response
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold">{formatShortNumber(totalRequests)}</div>
                                <div className="text-xs text-gray-500">Total Requests</div>
                              </div>
                            </div>
                            <div className="w-full h-[200px] relative">
                              <div className="absolute inset-0 flex items-end justify-between gap-4 px-2">
                                {httpRequestsData.map((item, index) => (
                                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div 
                                      className="w-full bg-blue-400 rounded-t-sm transition-all duration-300 hover:bg-blue-500"
                                      style={{ 
                                        height: `${item.requests > 0 ? (item.requests / 34) * 80 : 0}px`,
                                        minHeight: '2px'
                                      }}
                                    />
                                    <div 
                                      className="w-full bg-green-400 rounded-t-sm transition-all duration-300 hover:bg-green-500"
                                      style={{ 
                                        height: `${item.requests > 0 ? (item.requests / 34) * 80 : 0}px`,
                                        minHeight: '2px'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                                {httpRequestsData.map((item, index) => (
                                  <span key={index} className="text-xs transform -rotate-45 origin-left">{item.handler}</span>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Handler Breakdown</h4>
                              <div className="space-y-1">
                                {httpRequestsData.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                      <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs text-gray-700 bg-gray-100">
                                        {item.handler}
                                      </span>
                                      <span className="text-gray-500">{item.requests} req</span>
                                    </div>
                                    <div className="flex gap-4 text-xs">
                                      <span>↑ {formatBytes(item.requests * 4)}</span>
                                      <span>↓ {formatBytes(item.requests * 10240)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                              Content length of incoming requests by handler. Only value of header is respected. Otherwise ignored. No percentile calculated.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div className="flex-1 outline-none space-y-6">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-6 scroll-smooth">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="min-h-[400px] w-full">
                    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                        <h4 className="text-base font-medium">Process Metrics</h4>
                        <CpuIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="px-6 pb-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CpuIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">Runtime Environment</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500">Python Version</div>
                            <div className="font-semibold">CPython 3.9.6</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">System Health</span>
                          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-green-500 text-white border-transparent">
                            Healthy
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <DatabaseIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">Memory Usage</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Virtual</div>
                              <div className="font-semibold">0 B</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Resident</div>
                              <div className="font-semibold">0 B</div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Memory Efficiency</span>
                              <span>0.0%</span>
                            </div>
                            <div className="bg-blue-100 relative w-full overflow-hidden rounded-full h-2">
                              <div className="bg-blue-500 h-full w-full flex-1 transition-all" style={{ transform: 'translateX(-100%)' }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FileTextIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">File Descriptors</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">0 / 0 open</span>
                            <span>0.0%</span>
                          </div>
                          <div className="bg-blue-100 relative w-full overflow-hidden rounded-full h-2">
                            <div className="bg-blue-500 h-full w-full flex-1 transition-all" style={{ transform: 'translateX(-100%)' }}></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <CpuIcon className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-500">CPU Time</span>
                            </div>
                            <div className="font-semibold">0.00s</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <ClockIcon className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-500">Uptime</span>
                            </div>
                            <div className="font-semibold">Unknown</div>
                          </div>
                        </div>
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-500 hover:text-gray-900">Raw Values</summary>
                          <div className="mt-2 space-y-1 font-mono bg-gray-50 p-2 rounded">
                            <div>Virtual Memory: 0 bytes</div>
                            <div>Resident Memory: 0 bytes</div>
                            <div>CPU Seconds: 0</div>
                            <div>Start Time: 01/01/1970, 01:00:00</div>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Functions Tab */}
        {activeTab === 'functions' && (
          <div className="flex-1 outline-none space-y-6">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-6 scroll-smooth">
              <div className="space-y-6">
                <div className="w-full">
                  <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                      <h4 className="text-base font-medium">Function Calls</h4>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code h-4 w-4 text-gray-400">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                    </div>
                    <div className="px-6 pb-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Total Functions: {data?.functions.functions.length ?? 0}</span>
                          <span className="text-gray-500">Total Calls: {formatShortNumber(totalFunctionCalls)}</span>
                        </div>
                        <div className="rounded-md border max-h-64 overflow-auto">
                          <div className="relative w-full overflow-x-auto">
                            <table className="w-full caption-bottom text-sm">
                              <thead className="border-b">
                                <tr className="hover:bg-gray-50 border-b transition-colors">
                                  <th className="text-gray-900 h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center space-x-1">
                                      <span>Function</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down h-3 w-3">
                                        <path d="m21 16-4 4-4-4"></path>
                                        <path d="M17 20V4"></path>
                                        <path d="m3 8 4-4 4 4"></path>
                                        <path d="M7 4v16"></path>
                                      </svg>
                                    </div>
                                  </th>
                                  <th className="text-gray-900 h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center space-x-1">
                                      <span>Calls</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down h-3 w-3">
                                        <path d="m21 16-4 4-4-4"></path>
                                        <path d="M17 20V4"></path>
                                        <path d="m3 8 4-4 4 4"></path>
                                        <path d="M7 4v16"></path>
                                      </svg>
                                    </div>
                                  </th>
                                  <th className="text-gray-900 h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center space-x-1">
                                      <span>Avg Duration</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down h-3 w-3">
                                        <path d="m21 16-4 4-4-4"></path>
                                        <path d="M17 20V4"></path>
                                        <path d="m3 8 4-4 4 4"></path>
                                        <path d="M7 4v16"></path>
                                      </svg>
                                    </div>
                                  </th>
                                  <th className="text-gray-900 h-10 px-2 text-left align-middle font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center space-x-1">
                                      <span>Total Duration</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-down h-3 w-3">
                                        <path d="m21 16-4 4-4-4"></path>
                                        <path d="M17 20V4"></path>
                                        <path d="m3 8 4-4 4 4"></path>
                                        <path d="M7 4v16"></path>
                                      </svg>
                                    </div>
                                  </th>
                                  <th className="text-gray-900 h-10 px-2 text-left align-middle font-medium whitespace-nowrap">%</th>
                                  <th className="text-gray-900 h-10 px-2 text-left align-middle font-medium whitespace-nowrap">Impact</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data?.functions.functions.map((func, index) => {
                                  const percentage = totalFunctionCalls > 0 ? (func.calls / totalFunctionCalls * 100).toFixed(1) : '0.0';
                                  const impact = func.calls > 1000000 ? 'High' : func.calls > 1000 ? 'Medium' : 'Low';
                                  const impactColor = impact === 'High' ? 'bg-red-500' : impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500';
                                  const avgDuration = func.avgDurationSeconds ? func.avgDurationSeconds * 1000 : 0; // Convert to ms
                                  const totalDuration = avgDuration * func.calls;
                                  
                                  return (
                                    <tr key={index} className="hover:bg-gray-50 border-b transition-colors">
                                      <td className="p-2 align-middle whitespace-nowrap font-mono text-sm">{func.name}</td>
                                      <td className="p-2 align-middle whitespace-nowrap font-medium">{formatShortNumber(func.calls)}</td>
                                      <td className="p-2 align-middle whitespace-nowrap font-mono text-sm">{formatDuration(avgDuration)}</td>
                                      <td className="p-2 align-middle whitespace-nowrap font-mono text-sm">{formatDuration(totalDuration)}</td>
                                      <td className="p-2 align-middle whitespace-nowrap text-gray-500">{percentage}%</td>
                                      <td className="p-2 align-middle whitespace-nowrap">
                                        <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 text-white border-transparent ${impactColor}`}>
                                          {impact}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
