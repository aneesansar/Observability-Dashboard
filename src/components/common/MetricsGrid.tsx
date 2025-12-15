import { useEffect, useState } from 'react';
import StatsCard from '@/components/common/StatsCard';

export type MetricsGridCard = {
  title: string;
  subtitle?: string;
  value: number | string;
  icon?: React.ReactNode;
  badge?: { label: string; variant: 'success' | 'warning' | 'info' | 'error' };
  borderColor?: string; // tailwind border color class
  trend?: { value: string; isPositive: boolean; label?: string };
};

export type MetricsGridProps<T> = {
  load: () => Promise<T>;
  mapCards: (data: T) => MetricsGridCard[];
  skeletonCount?: number;
  onLoaded?: (data: T) => void;
  onError?: (err: unknown) => void;
  errorRenderer?: (err: unknown) => React.ReactNode;
};

export default function MetricsGrid<T>({
  load,
  mapCards,
  skeletonCount = 4,
  onLoaded,
  onError,
  errorRenderer,
}: MetricsGridProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await load();
        if (!mounted) return;
        setData(res);
        onLoaded?.(res);
      } catch (e) {
        if (!mounted) return;
        setError(e);
        onError?.(e);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [load, onLoaded, onError]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {errorRenderer ? errorRenderer(error) : String((error as any)?.message || 'Failed to load metrics')}
      </div>
    );
  }

  if (!data) return null;

  const cards = mapCards(data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => (
        <StatsCard
          key={idx}
          title={c.title}
          subtitle={c.subtitle}
          value={c.value}
          icon={c.icon}
          badge={c.badge}
          borderColor={c.borderColor}
          trend={c.trend}
        />
      ))}
    </div>
  );
}
