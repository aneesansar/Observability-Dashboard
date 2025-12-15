import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface LogsFilterProps {
  onSearchChange?: (value: string) => void;
  onLevelChange?: (value: string) => void;
  onServiceChange?: (value: string) => void;
}

export default function LogsFilter({ onSearchChange, onLevelChange, onServiceChange }: LogsFilterProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedService, setSelectedService] = useState("All Services");

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
    <div className="bg-white flex flex-col gap-6 rounded-xl border">
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
                className="bg-gray-100 h-9 w-full rounded-md border px-3 py-1 text-base pl-8"
              />
            </div>
          </div>
          <select
            value={selectedLevel}
            onChange={handleLevelChange}
            className="bg-gray-100 h-9 w-[120px] rounded-md border px-3 py-2 text-sm"
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
            className="bg-gray-100 h-9 w-[150px] rounded-md border px-3 py-2 text-sm"
          >
            <option>All Services</option>
            <option>API Service</option>
            <option>Database</option>
            <option>Auth Service</option>
            <option>Cache</option>
          </select>
        </div>
      </div>
    </div>
  );
}
