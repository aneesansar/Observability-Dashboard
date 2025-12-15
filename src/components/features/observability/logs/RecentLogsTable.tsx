import Table from '@/components/common/Table';
import type { TableColumn } from '@/types/components.types';

export type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  requestId: string;
}

interface RecentLogsTableProps {
  data: LogEntry[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function RecentLogsTable({ data, page, pageSize, total, onPageChange }: RecentLogsTableProps) {
  const columns: TableColumn<LogEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row) => (
        <span className="font-mono text-xs sm:text-sm">{row.timestamp}</span>
      ),
      headerClassName: 'w-[180px]',
    },
    {
      key: 'level',
      header: 'Level',
      render: (row) => {
        const levelColor =
          row.level === 'ERROR'
            ? 'text-red-500'
            : row.level === 'WARN'
            ? 'text-yellow-500'
            : row.level === 'DEBUG'
            ? 'text-blue-500'
            : 'text-green-500';

        const badgeBg =
          row.level === 'ERROR'
            ? 'bg-red-500 text-white'
            : row.level === 'WARN'
            ? 'bg-yellow-100 text-yellow-800'
            : row.level === 'DEBUG'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800';

        return (
          <div className="flex items-center gap-2">
            <span className={`h-4 w-4 ${levelColor}`}>●</span>
            <span className={`inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium whitespace-nowrap ${badgeBg}`}>
              {row.level}
            </span>
          </div>
        );
      },
      headerClassName: 'w-[80px]',
    },
    {
      key: 'service',
      header: 'Service',
      render: (row) => (
        <span className="inline-flex items-center justify-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-gray-100 text-gray-800">
          {row.service}
        </span>
      ),
      headerClassName: 'w-[140px]',
    },
    {
      key: 'message',
      header: 'Message',
      render: (row) => (
        <span className="text-sm text-gray-900 truncate block max-w-[400px]">{row.message}</span>
      ),
    },
    {
      key: 'requestId',
      header: 'Request ID',
      render: (row) => (
        <span className="font-mono text-[11px] sm:text-xs text-gray-500">{row.requestId}</span>
      ),
      headerClassName: 'w-[140px]',
    },
  ];

  return (
    <div className="mt-6">
      <Table<LogEntry>
        data={data}
        columns={columns}
        getRowKey={(row) => `${row.requestId}-${row.timestamp}`}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        emptyMessage="No logs found for the selected filters."
      />
    </div>
  );
}
