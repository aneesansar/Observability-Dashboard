import { apiClient } from './api.client';
import type { ObservabilityStatsResponse } from '@/types/observability.types';

export type ObservabilityMetricsSummary = {
  tenant_id: string;
  timestamp: number;
  runtime_environment: {
    python_version: string;
    python_implementation: string;
    python_version_info: string;
  };
  system_health: {
    status: string;
    uptime_seconds: number;
    uptime_formatted: string;
  };
  memory_usage: {
    virtual: {
      total: number;
      available: number;
      used: number;
      percentage: number;
      formatted: {
        total: string;
        used: string;
        available: string;
      };
    };
    resident: {
      rss: number;
      vms: number;
      formatted: {
        rss: string;
        vms: string;
      };
    };
    memory_efficiency: number;
    swap: {
      total: number;
      used: number;
      percentage: number;
      formatted: {
        total: string;
        used: string;
      };
    };
  };
  file_descriptors: {
    open: number;
    max: number;
    percentage: number;
  };
  cpu_time: {
    user_time: number;
    system_time: number;
    total_cpu_time: number;
    cpu_percentage: number;
  };
  request_metrics: {
    total_requests: number;
    http_requests: number;
    llm_requests: number;
    rag_requests: number;
    avg_response_time_seconds: number;
    error_rate_percent: number;
  };
  status: string;
};

export type ObservabilityLogApiEntry = {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  tenant_id: string;
  username: string;
  trace_id: string | null;
  span_id: string | null;
  metadata?: {
    filename?: string;
    line?: number;
    function?: string;
    logger?: string;
  };
};

export type ObservabilityTraceSpan = {
  trace_id: string;
  span_id: string;
  parent_span_id: string | null;
  name: string;
  kind: string;
  status: string;
  attributes: Record<string, string>;
  events: Array<{
    name: string;
    time: number;
    tenant_id: string | null;
    [key: string]: unknown;
  }>;
  children: ObservabilityTraceSpan[];
};

export type ObservabilityTrace = {
  trace_id: string;
  spans: ObservabilityTraceSpan[];
};

export type ObservabilityTracesResponse = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  data: ObservabilityTrace[];
};

/**
 * Observability API Service
 * Fetches observability statistics and raw metrics for the dashboard.
 */
export const observabilityService = {
  /**
   * Get observability stats summary (JSON)
   */
  async getStats(): Promise<ObservabilityStatsResponse> {
    const response = await apiClient.get<ObservabilityStatsResponse>('/api/v1/observability/stats');
    return response.data;
  },

  /**
   * Get raw observability metrics in Prometheus text exposition format
   */
  async getMetrics(): Promise<string> {
    const response = await apiClient.get<string>('/api/v1/observability/metrics', {
      responseType: 'text',
      transformResponse: (data) => data,
    });
    return response.data;
  },

  /**
   * Get system metrics summary (JSON)
   */
  async getMetricsSummary(): Promise<ObservabilityMetricsSummary> {
    const response = await apiClient.get<ObservabilityMetricsSummary>('/api/v1/observability/metrics/summary');
    return response.data;
  },

  /**
   * Get recent logs
   */
  async getLogs(params?: { level?: string | null; limit?: number }): Promise<ObservabilityLogApiEntry[]> {
    const response = await apiClient.get<ObservabilityLogApiEntry[]>('/api/v1/observability/logs', {
      params: {
        level: params?.level ?? undefined,
        limit: params?.limit ?? 20,
      },
    });
    return response.data;
  },

  /**
   * Get traces with spans
   */
  async getTraces(params?: {
    page?: number;
    limit?: number;
    window_seconds?: number;
    max_spans?: number;
  }): Promise<ObservabilityTracesResponse> {
    const response = await apiClient.get<ObservabilityTracesResponse>('/api/v1/observability/traces', {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 50,
        window_seconds: params?.window_seconds ?? 0,
        max_spans: params?.max_spans ?? 2000,
      },
    });
    return response.data;
  },
};
