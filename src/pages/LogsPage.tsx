import { AppLayout } from '@/components/Layout';
import PageTitle from '@/components/common/PageTitle';
import { InformationCircleIcon, XCircleIcon, ExclamationTriangleIcon, CheckCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useMemo, useState, useEffect, useContext } from 'react';
import { RecentLogsTable } from '@/components/features/observability/logs/RecentLogsTable';
import type { LogEntry, LogLevel } from '@/components/features/observability/logs/RecentLogsTable';
import { observabilityService } from '@/services/api';
import { FeedbackContext } from '@/context/FeedbackContext';

interface LogsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

function LogsCard({ title, value, icon: Icon, color = 'text-gray-400' }: LogsCardProps) {
  return (
    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-2xl font-semibold ${color === 'text-red-600' ? 'text-red-600' : color === 'text-yellow-600' ? 'text-yellow-600' : color === 'text-green-500' ? 'text-green-500' : 'text-rich-black'}`}>
              {value}
            </p>
          </div>
          <Icon className={`h-8 w-8 ${color === 'text-red-500' ? 'text-red-500' : color === 'text-yellow-500' ? 'text-yellow-500' : color === 'text-green-500' ? 'text-green-500' : 'text-gray-400'}`} />
        </div>
      </div>
    </div>
  );
}

function LogsFilter({ 
  onSearchChange, 
  onLevelChange, 
  onServiceChange,
  services,
}: {
  onSearchChange?: (value: string) => void;
  onLevelChange?: (value: string) => void;
  onServiceChange?: (value: string) => void;
  services: string[];
}) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedService, setSelectedService] = useState('All Services');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLevel(value);
    onLevelChange?.(value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedService(value);
    onServiceChange?.(value);
  };

  return (
    <div className="bg-white flex flex-col gap-6 rounded-xl border border-gray-200">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchValue}
                onChange={handleSearchChange}
                className="bg-gray-100 h-9 w-full rounded-md border border-gray-200 px-3 py-1 text-base pl-8"
              />
            </div>
          </div>
          
          <select
            value={selectedLevel}
            onChange={handleLevelChange}
            className="bg-gray-100 h-9 w-[120px] rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option>All Levels</option>
            <option>Error</option>
            <option>Warning</option>
            <option>Info</option>
            <option>Debug</option>
          </select>

          <select
            value={selectedService}
            onChange={handleServiceChange}
            className="bg-gray-100 h-9 w-[150px] rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option>All Services</option>
            {services.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function LogsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    level: 'All Levels',
    service: 'All Services'
  });

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const feedbackCtx = useContext(FeedbackContext);

  const mapLevelToApi = (level: string): string | null => {
    if (level === 'Error') return 'ERROR';
    if (level === 'Warning') return 'WARN';
    if (level === 'Info') return 'INFO';
    if (level === 'Debug') return 'DEBUG';
    return null;
  };

  const loadLogs = async () => {
    setIsLoading(true);
    setError(null);

    // Show loading message when refresh starts
    if (feedbackCtx) {
      feedbackCtx.setFeedbackMessage('Refreshing logs...');
      feedbackCtx.setFeedbackStatus(undefined); // Info status (blue)
    }

    try {
      const apiLevel = mapLevelToApi(filters.level);
      const response = await observabilityService.getLogs({
        level: apiLevel,
        limit: pageSize,
      });

      const mapped: LogEntry[] = response.map((log) => ({
        timestamp: new Date(log.timestamp).toLocaleString(),
        level: log.level as LogLevel,
        service: log.service,
        message: log.message,
        requestId: log.id,
      }));

      setLogs(mapped);

      // Show success message in header feedback component
      if (feedbackCtx) {
        feedbackCtx.setFeedbackMessage('Logs updated successfully');
        feedbackCtx.setFeedbackStatus(200);
      }
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to load logs:', err);
      const message = err?.message || 'Failed to load logs';
      setError(message);

      // Show error message in header feedback component
      if (feedbackCtx) {
        feedbackCtx.setFeedbackMessage(message);
        feedbackCtx.setFeedbackStatus(500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.level, filters.service]);

  useEffect(() => {
    void loadLogs();
  }, [filters.level]);

  const handleRefresh = () => {
    void loadLogs();
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleLevelChange = (value: string) => {
    setFilters(prev => ({ ...prev, level: value }));
  };

  const handleServiceChange = (value: string) => {
    setFilters(prev => ({ ...prev, service: value }));
  };

  const filteredLogs = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const levelFilter = filters.level;
    const serviceFilter = filters.service;

    return logs.filter((log) => {
      const matchesSearch =
        !search ||
        log.message.toLowerCase().includes(search) ||
        log.requestId.toLowerCase().includes(search) ||
        log.service.toLowerCase().includes(search);

      const matchesLevel =
        levelFilter === 'All Levels' || log.level === (levelFilter as LogLevel);

      const matchesService =
        serviceFilter === 'All Services' || log.service === serviceFilter;

      return matchesSearch && matchesLevel && matchesService;
    });
  }, [logs, filters.search, filters.level, filters.service]);

  const totalLogs = filteredLogs.length;
  const pageStart = (page - 1) * pageSize;
  const pageData = filteredLogs.slice(pageStart, pageStart + pageSize);

  const services = useMemo(
    () => Array.from(new Set(logs.map((log) => log.service))).sort(),
    [logs],
  );

  return (
    <AppLayout padded={true}>
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between mt-1 mb-4">
          <PageTitle>Logs</PageTitle>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gradient-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <LogsCard
            title="Total Logs"
            value={totalLogs.toString()}
            icon={InformationCircleIcon}
          />
          <LogsCard
            title="Errors"
            value={filteredLogs.filter(log => log.level === 'ERROR').length.toString()}
            icon={XCircleIcon}
            color="text-red-600"
          />
          <LogsCard
            title="Warnings"
            value={filteredLogs.filter(log => log.level === 'WARN').length.toString()}
            icon={ExclamationTriangleIcon}
            color="text-yellow-600"
          />
          <LogsCard
            title="Services"
            value={Array.from(new Set(filteredLogs.map(log => log.service))).length.toString()}
            icon={CheckCircleIcon}
            color="text-green-500"
          />
        </div>

        {/* Logs Filter */}
        <LogsFilter
          onSearchChange={handleSearchChange}
          onLevelChange={handleLevelChange}
          onServiceChange={handleServiceChange}
          services={services}
        />

        <RecentLogsTable
          data={pageData}
          page={page}
          pageSize={pageSize}
          total={totalLogs}
          onPageChange={setPage}
        />
      </div>
    </AppLayout>
  );
}
