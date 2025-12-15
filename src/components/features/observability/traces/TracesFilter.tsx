import { MagnifyingGlassIcon, FunnelIcon, CalendarDaysIcon, ClockIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export interface TracesFilterProps {
  onSearchChange?: (value: string) => void;
  onServiceChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onMinDurationChange?: (value: number | undefined) => void;
  onMaxDurationChange?: (value: number | undefined) => void;
  onTimeRangeClick?: () => void;
  services: string[];
  statuses: string[];
}

export function TracesFilter({
  onSearchChange,
  onServiceChange,
  onStatusChange,
  onMinDurationChange,
  onMaxDurationChange,
  onTimeRangeClick,
  services,
  statuses,
}: TracesFilterProps) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedService, setSelectedService] = useState('All services');
  const [selectedStatus, setSelectedStatus] = useState('All statuses');
  const [minDuration, setMinDuration] = useState<string>('');
  const [maxDuration, setMaxDuration] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedService(value);
    onServiceChange?.(value === 'All services' ? '' : value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onStatusChange?.(value === 'All statuses' ? '' : value);
  };

  const handleMinDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinDuration(value);
    const numeric = value === '' ? undefined : Number(value);
    onMinDurationChange?.(Number.isNaN(numeric as number) ? undefined : numeric);
  };

  const handleMaxDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxDuration(value);
    const numeric = value === '' ? undefined : Number(value);
    onMaxDurationChange?.(Number.isNaN(numeric as number) ? undefined : numeric);
  };

  return (
    <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
      <div className="p-4 space-y-4">
        {/* Top row: search + service/status + filters button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search spans, trace IDs, operations..."
              value={searchValue}
              onChange={handleSearchChange}
              className="bg-gray-100 file:text-foreground placeholder:text-gray-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border border-gray-200 px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 pl-10"
            />
          </div>

          {/* Service select */}
          <div className="relative w-48">
            <select
              value={selectedService}
              onChange={handleServiceChange}
              className="border-input data-placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 w-full appearance-none pr-8"
            >
              <option>All services</option>
              {services.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Status select */}
          <div className="relative w-36">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="border-input data-placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 w-full appearance-none pr-8"
            >
              <option>All statuses</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Filters button (no-op for now, but styled) */}
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-8 rounded-md px-3 gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Second row: time range + min/max duration (shown when Filters is clicked) */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Time Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <button
                type="button"
                onClick={onTimeRangeClick}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 h-9 px-4 py-2 w-full justify-start text-left font-normal"
              >
                <CalendarDaysIcon className="mr-2 h-4 w-4" />
                Select date range
              </button>
            </div>

            {/* Min Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Duration (ms)</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="0"
                  min={0}
                  value={minDuration}
                  onChange={handleMinDurationChange}
                  className="file:text-foreground placeholder:text-gray-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border border-gray-200 px-3 py-1 text-base bg-gray-100 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 pl-10"
                />
              </div>
            </div>

            {/* Max Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Duration (ms)</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="No limit"
                  min={0}
                  value={maxDuration}
                  onChange={handleMaxDurationChange}
                  className="file:text-foreground placeholder:text-gray-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border border-gray-200 px-3 py-1 text-base bg-gray-100 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-blue-500 focus-visible:ring-blue-500/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 pl-10"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
