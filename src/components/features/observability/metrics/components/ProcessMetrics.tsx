import { CpuIcon, HardDriveIcon, FileTextIcon, ClockIcon } from 'lucide-react';

interface ProcessMetricsProps {
  summary: any;
  className?: string;
}

export function ProcessMetrics({ summary, className = '' }: ProcessMetricsProps) {
  return (
    <div className={`bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 ${className}`}>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
        <h4 className="text-base font-medium">Process Metrics</h4>
        <CpuIcon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="px-6 pb-6 space-y-4">
        {/* Runtime Environment */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CpuIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">Runtime Environment</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Python Version</div>
            <div className="font-semibold">{summary?.runtime_environment?.python_version?.split(' ')[0] ?? '3.12.0'}</div>
          </div>
        </div>

        {/* System Health */}
        <div className="flex items-center justify-between">
          <span className="text-sm">System Health</span>
          <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-transparent text-white ${
            summary?.system_health?.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {summary?.system_health?.status ?? 'Healthy'}
          </span>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <HardDriveIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">Memory Usage</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Virtual</div>
              <div className="font-semibold">{summary?.memory_usage?.virtual?.formatted?.used ?? '0 B'}</div>
            </div>
            <div>
              <div className="text-gray-500">Resident</div>
              <div className="font-semibold">{summary?.memory_usage?.resident?.formatted?.rss ?? '0 B'}</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Memory Efficiency</span>
              <span>{summary?.memory_usage?.memory_efficiency?.toFixed(1) ?? '0.0'}%</span>
            </div>
            <div className="bg-blue-100 relative w-full overflow-hidden rounded-full h-2">
              <div className="bg-blue-500 h-full flex-1 transition-all" style={{ transform: `translateX(-${100 - (summary?.memory_usage?.memory_efficiency ?? 0)}%)` }}></div>
            </div>
          </div>
        </div>

        {/* File Descriptors */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FileTextIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">File Descriptors</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{summary?.file_descriptors?.open ?? 0} / {summary?.file_descriptors?.max ?? 0} open</span>
            <span>{summary?.file_descriptors?.percentage?.toFixed(1) ?? '0.0'}%</span>
          </div>
          <div className="bg-blue-100 relative w-full overflow-hidden rounded-full h-2">
            <div className="bg-blue-500 h-full flex-1 transition-all" style={{ transform: `translateX(-${100 - (summary?.file_descriptors?.percentage ?? 0)}%)` }}></div>
          </div>
        </div>

        {/* CPU Time and Uptime */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <CpuIcon className="h-3 w-3 text-gray-400" />
              <span className="text-sm text-gray-500">CPU Time</span>
            </div>
            <div className="font-semibold">{summary?.cpu_time?.total_cpu_time?.toFixed(2) ?? '0.00'}s</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-3 w-3 text-gray-400" />
              <span className="text-sm text-gray-500">Uptime</span>
            </div>
            <div className="font-semibold">{summary?.system_health?.uptime_formatted ?? 'Unknown'}</div>
          </div>
        </div>

        {/* Raw Values */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">Raw Values</summary>
          <div className="mt-2 space-y-1 font-mono bg-gray-50 p-2 rounded">
            <div>Virtual Memory: {summary?.memory_usage?.virtual?.total?.toLocaleString() ?? '0'} bytes</div>
            <div>Resident Memory: {summary?.memory_usage?.resident?.rss?.toLocaleString() ?? '0'} bytes</div>
            <div>CPU Seconds: {summary?.cpu_time?.total_cpu_time?.toFixed(2) ?? '0'}</div>
            <div>Start Time: {summary?.timestamp ? new Date(summary.timestamp * 1000).toLocaleString() : '01/01/1970, 01:00:00'}</div>
          </div>
        </details>
      </div>
    </div>
  );
}
