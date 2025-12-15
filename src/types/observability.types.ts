export type ObservabilityStatusValue = 'success' | 'warning' | 'error' | 'info';

export type ObservabilityApplicationPerformance = {
  response_time_ms: number;
  throughput_per_min: number;
  error_rate_percent: number;
  total_llm_calls: number;
};

export type ObservabilityQualityMetrics = {
  avg_semantic_similarity: number;
  avg_hallucination_score: number;
};

export type ObservabilityMetricStatus = {
  response_time: ObservabilityStatusValue;
  throughput: ObservabilityStatusValue;
  error_rate: ObservabilityStatusValue;
  llm_calls: ObservabilityStatusValue;
};

export type ObservabilitySimpleMetric = {
  value: number;
  change: number;
  status: ObservabilityStatusValue;
};

export type ObservabilitySystemPerformance = {
  cpu_usage: ObservabilitySimpleMetric;
  memory_usage: ObservabilitySimpleMetric;
  disk_io: ObservabilitySimpleMetric;
  network: ObservabilitySimpleMetric;
};

export type ObservabilityStatsResponse = {
  application_performance: ObservabilityApplicationPerformance;
  quality_metrics: ObservabilityQualityMetrics;
  system_performance: ObservabilitySystemPerformance;
  status: ObservabilityMetricStatus;
};
