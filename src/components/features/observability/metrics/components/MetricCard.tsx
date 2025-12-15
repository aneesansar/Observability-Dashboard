import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function MetricCard({ title, icon, children, className = '' }: MetricCardProps) {
  return (
    <div className={`bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 ${className}`}>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
        <h4 className="text-base font-medium">{title}</h4>
        {icon}
      </div>
      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  );
}
