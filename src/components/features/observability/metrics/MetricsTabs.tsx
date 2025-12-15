import { useState } from 'react';
import { 
  BoltIcon, 
  ServerIcon, 
  ChartBarIcon, 
  CpuChipIcon, 
  ClockIcon, 
  GlobeAltIcon, 
  ArrowTrendingUpIcon, 
  DocumentTextIcon, 
  ServerStackIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

export default function MetricsTabs() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', name: 'All Metrics', icon: BoltIcon },
    { id: 'gc', name: 'Garbage Collection', icon: ServerIcon },
    { id: 'http', name: 'HTTP Requests', icon: ChartBarIcon },
    { id: 'process', name: 'Process & Runtime', icon: CpuChipIcon },
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
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                h-[calc(100%-1px)] flex-1 justify-center gap-1.5 rounded-xl border border-transparent 
                px-2 py-1 text-sm font-medium whitespace-nowrap transition-all
                flex items-center space-x-2
                ${isActive 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
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
        {activeTab === 'all' && <AllMetricsContent />}
        {activeTab === 'gc' && <GCMetricsContent />}
        {activeTab === 'http' && <HTTPMetricsContent />}
        {activeTab === 'process' && <ProcessMetricsContent />}
        {activeTab === 'functions' && <FunctionMetricsContent />}
      </div>
    </div>
  );
}

function AllMetricsContent() {
  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-6 scroll-smooth">
      {/* HTTP & Performance Metrics */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <ChartBarIcon className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">HTTP & Performance Metrics</h3>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* HTTP Requests Card */}
        <div className="w-full">
          <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <h4 className="text-base font-medium">HTTP Requests</h4>
              <GlobeAltIcon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">7.0B</div>
                  <div className="text-sm text-gray-500">Total Requests</div>
                </div>
                {/* Placeholder for chart */}
                <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <ChartBarIcon className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Duration Histogram */}
        <div className="w-full">
          <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <h4 className="text-base font-medium">Request Duration Histogram</h4>
              <ClockIcon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold">5.6ms</div>
                    <div className="text-xs text-gray-500">Avg Latency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">54</div>
                    <div className="text-xs text-gray-500">Total Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">302.7ms</div>
                    <div className="text-xs text-gray-500">Total Time</div>
                  </div>
                </div>
                {/* Placeholder for histogram */}
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <ArrowTrendingUpIcon className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GC Collections */}
        <div className="min-h-[400px] w-full">
          <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <h4 className="text-base font-medium">GC Collections</h4>
              <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">2791</div>
                    <div className="text-xs text-gray-500">Gen 0</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">253</div>
                    <div className="text-xs text-gray-500">Gen 1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">13</div>
                    <div className="text-xs text-gray-500">Gen 2</div>
                  </div>
                </div>
                {/* Placeholder for line chart */}
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <ArrowTrendingUpIcon className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HTTP Transfer Sizes */}
        <div className="min-h-[400px] w-full">
          <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <h4 className="text-base font-medium">HTTP Transfer Sizes</h4>
              <DocumentTextIcon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">75.85 B</div>
                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                      </svg>
                      Avg Request
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">23.97 KB</div>
                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      Avg Response
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">54</div>
                    <div className="text-xs text-gray-500">Total Requests</div>
                  </div>
                </div>
                {/* Placeholder for bar chart */}
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <ChartBarIcon className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Metrics */}
        <div className="min-h-[400px] w-full">
          <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
              <h4 className="text-base font-medium">Process Metrics</h4>
              <CpuChipIcon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">Runtime Environment</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Python Version</div>
                  <div className="font-semibold">CPython 3.9.6</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Health</span>
                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                  Healthy
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ServerStackIcon className="h-4 w-4 text-gray-400" />
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
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <BoltIcon className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Additional Metrics</h3>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="min-h-[350px] w-full">
              <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
                  <h4 className="text-base font-medium">Uncollectable Objects</h4>
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                </div>
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">0</div>
                      <p className="text-sm text-gray-500">Total Uncollectable</p>
                      <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-green-500 text-white">
                        Healthy
                      </span>
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
  );
}

function GCMetricsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Garbage Collection Metrics</h3>
        <p className="text-gray-600">GC metrics will be displayed here...</p>
      </div>
    </div>
  );
}

function HTTPMetricsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HTTP Request Metrics</h3>
        <p className="text-gray-600">HTTP metrics will be displayed here...</p>
      </div>
    </div>
  );
}

function ProcessMetricsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Process & Runtime Metrics</h3>
        <p className="text-gray-600">Process metrics will be displayed here...</p>
      </div>
    </div>
  );
}

function FunctionMetricsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Function Performance Metrics</h3>
        <p className="text-gray-600">Function metrics will be displayed here...</p>
      </div>
    </div>
  );
}
