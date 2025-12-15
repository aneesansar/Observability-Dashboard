import { useMetricsContext } from '@/context/MetricsContext';

export const useMetrics = () => {
  return useMetricsContext();
};
