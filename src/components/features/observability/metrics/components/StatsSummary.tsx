import type { ReactNode } from 'react';

interface StatItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

interface StatsSummaryProps {
  stats: StatItem[];
  layout?: 'grid' | 'flex';
  columns?: number;
  className?: string;
}

export function StatsSummary({ stats, layout = 'grid', columns = 3, className = '' }: StatsSummaryProps) {
  const gridClass = layout === 'grid' 
    ? `grid grid-cols-${columns} gap-4` 
    : 'flex justify-between items-center gap-4';

  return (
    <div className={`${gridClass} p-3 bg-gray-50 rounded-lg ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
            {stat.icon}
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
