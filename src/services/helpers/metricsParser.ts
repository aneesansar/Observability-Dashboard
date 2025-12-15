export type ParsedHttpMetrics = {
  totalRequests: number;
  handlers: { handler: string; requests: number }[];
  methods: { method: string; count: number }[];
  status: { status: string; count: number }[];
  requestTypes: { request_type: string; count: number }[];
  httpStatusBreakdown: { status_code: string; method: string; count: number }[];
};

export type ParsedLatencyHistogramBucket = {
  le: string;
  count: number;
};

export type ParsedLatencyMetrics = {
  highResBuckets: ParsedLatencyHistogramBucket[];
  highResCount: number;
  highResSum: number;
};

export type ParsedGcMetrics = {
  collections: { generation: string; count: number }[];
  uncollectable: { generation: string; count: number }[];
};

export type ParsedTransferSizeMetrics = {
  handlers: {
    handler: string;
    requestCount: number;
    requestSumBytes: number;
    responseCount: number;
    responseSumBytes: number;
  }[];
};

export type ParsedFunctionMetrics = {
  functions: {
    name: string;
    calls: number;
    avgDurationSeconds: number | null;
    status?: string;
  }[];
};

export type ParsedObservabilityMetrics = {
  raw: string;
  http: ParsedHttpMetrics;
  latency: ParsedLatencyMetrics;
  gc: ParsedGcMetrics;
  transfer: ParsedTransferSizeMetrics;
  functions: ParsedFunctionMetrics;
  pythonVersion: string | null;
  tenantId: string | null;
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    totalErrors: number;
    avgResponseTime: number;
  };
  functionErrors: { function_name: string; error_type: string; count: number }[];
};

export const parseObservabilityMetrics = (
  raw: string
): ParsedObservabilityMetrics => {
  const httpHandlerMap = new Map<string, number>();
  const httpMethodMap = new Map<string, number>();
  const httpStatusMap = new Map<string, number>();
  const httpRequestTypeMap = new Map<string, number>();
  const httpStatusBreakdownMap = new Map<string, { method: string; count: number }>();

  const latencyBuckets: ParsedLatencyHistogramBucket[] = [];
  let latencyHighResCount = 0;
  let latencyHighResSum = 0;

  const gcCollectionsMap = new Map<string, number>();
  const gcUncollectableMap = new Map<string, number>();

  const transferHandlers = new Map<
    string,
    { reqCount: number; reqSum: number; resCount: number; resSum: number }
  >();

  const functionCallMap = new Map<string, number>();
  const functionDurationCount = new Map<string, number>();
  const functionDurationSum = new Map<string, number>();
  const functionStatusMap = new Map<string, string>();

  const functionErrorMap = new Map<string, { error_type: string; count: number }>();

  let pythonVersion: string | null = null;
  let tenantId: string | null = null;
  let systemCpuUsage = 0;
  let systemMemoryUsage = 0;
  let totalErrors = 0;
  let avgResponseTime = 0;

  const lines = raw.split(/\r?\n/);

  const parseLabels = (labelStr: string): Record<string, string> => {
    const labels: Record<string, string> = {};
    const parts = labelStr.split(',').filter(Boolean);
    for (const part of parts) {
      const [k, v] = part.split('=');
      if (!k || !v) continue;
      labels[k.trim()] = v.replace(/^"|"$/g, '');
    }
    return labels;
  };

  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;

    const match = line.match(/^([^\{\s]+)(?:\{([^}]*)\})?\s+([\d.eE+-]+)$/);
    if (!match) continue;

    const [, metricName, labelStr = '', valueStr] = match;
    const value = parseFloat(valueStr);
    const labels = parseLabels(labelStr);

    switch (metricName) {
      // New tenant-specific HTTP metrics
      case 'tenant_requests_total': {
        const requestType = labels.request_type ?? 'unknown';
        const method = labels.http_method ?? 'UNKNOWN';
        const status = labels.http_status ?? 'unknown';
        const currentTenantId = labels.tenant_id;
        
        if (currentTenantId) {
          tenantId = currentTenantId;
        }
        
        httpRequestTypeMap.set(requestType, (httpRequestTypeMap.get(requestType) ?? 0) + value);
        httpMethodMap.set(method, (httpMethodMap.get(method) ?? 0) + value);
        httpStatusMap.set(status, (httpStatusMap.get(status) ?? 0) + value);
        
        // Don't add to handlers map here - tenant_requests_total doesn't have route info
        // Route info comes from tenant_http_status_total metric
        break;
      }

      case 'tenant_http_status_total': {
        const statusCode = labels.status_code ?? 'unknown';
        const method = labels.http_method ?? 'UNKNOWN';
        const route = labels.http_route ?? 'unknown';
        const currentTenantId = labels.tenant_id;
        
        if (currentTenantId) {
          tenantId = currentTenantId;
        }
        
        const key = `${statusCode}_${method}`;
        httpStatusBreakdownMap.set(key, { method, count: value });
        
        // Also add to handler map for compatibility
        httpHandlerMap.set(route, (httpHandlerMap.get(route) ?? 0) + value);
        break;
      }

      case 'tenant_function_calls_total': {
        const functionName = labels.function_name ?? 'unknown';
        const status = labels.status ?? 'unknown';
        const currentTenantId = labels.tenant_id;
        
        if (currentTenantId) {
          tenantId = currentTenantId;
        }
        
        functionCallMap.set(functionName, (functionCallMap.get(functionName) ?? 0) + value);
        functionStatusMap.set(functionName, status);
        break;
      }

      case 'tenant_errors_total': {
        const functionName = labels.function_name ?? 'unknown';
        const errorType = labels.error_type ?? 'unknown';
        const currentTenantId = labels.tenant_id;
        
        if (currentTenantId) {
          tenantId = currentTenantId;
        }
        
        totalErrors += value;
        functionErrorMap.set(functionName, { error_type: errorType, count: value });
        break;
      }

      case 'tenant_response_time_seconds_bucket': {
        const le = labels.le ?? '';
        const currentTenantId = labels.tenant_id;
        if (currentTenantId) {
          tenantId = currentTenantId;
        }
        
        // Create bucket key with request type
        const existingBucket = latencyBuckets.find(b => b.le === le);
        if (existingBucket) {
          existingBucket.count += value;
        } else {
          latencyBuckets.push({ le, count: value });
        }
        break;
      }
      case 'tenant_response_time_seconds_count': {
        const currentTenantId = labels.tenant_id;
        if (currentTenantId) {
          tenantId = currentTenantId;
        }
        latencyHighResCount += value;
        break;
      }
      case 'tenant_response_time_seconds_sum': {
        const currentTenantId = labels.tenant_id;
        if (currentTenantId) {
          tenantId = currentTenantId;
        }
        latencyHighResSum += value;
        avgResponseTime = latencyHighResCount > 0 ? latencyHighResSum / latencyHighResCount : 0;
        break;
      }

      // System metrics
      case 'system_cpu_percent': {
        systemCpuUsage = value;
        break;
      }
      case 'system_memory_percent': {
        systemMemoryUsage = value;
        break;
      }

      // Legacy HTTP metrics (for backward compatibility)
      case 'http_requests_total': {
        const handler = labels.handler ?? 'unknown';
        const method = labels.method ?? 'UNKNOWN';
        const status = labels.status ?? 'unknown';

        httpHandlerMap.set(handler, (httpHandlerMap.get(handler) ?? 0) + value);
        httpMethodMap.set(method, (httpMethodMap.get(method) ?? 0) + value);
        httpStatusMap.set(status, (httpStatusMap.get(status) ?? 0) + value);
        break;
      }

      // Legacy latency metrics (for backward compatibility)
      case 'http_request_duration_highr_seconds_bucket': {
        const le = labels.le ?? '';
        latencyBuckets.push({ le, count: value });
        break;
      }
      case 'http_request_duration_highr_seconds_count': {
        latencyHighResCount = value;
        break;
      }
      case 'http_request_duration_highr_seconds_sum': {
        latencyHighResSum = value;
        break;
      }

      case 'python_gc_collections_total': {
        const gen = labels.generation ?? 'unknown';
        gcCollectionsMap.set(gen, value);
        break;
      }
      case 'python_gc_objects_uncollectable_total': {
        const gen = labels.generation ?? 'unknown';
        gcUncollectableMap.set(gen, value);
        break;
      }

      // Legacy transfer size metrics (not available in new tenant format)
      // These metrics are empty in the new format, so we skip parsing them
      
      // Legacy function metrics (for backward compatibility)
      case 'function_calls_total': {
        const fn = labels.function ?? 'unknown';
        functionCallMap.set(fn, (functionCallMap.get(fn) ?? 0) + value);
        break;
      }
      case 'function_duration_seconds_count': {
        const fn = labels.function ?? 'unknown';
        functionDurationCount.set(fn, value);
        break;
      }
      case 'function_duration_seconds_sum': {
        const fn = labels.function ?? 'unknown';
        functionDurationSum.set(fn, value);
        break;
      }

      case 'python_info': {
        const impl = labels.implementation;
        const version = labels.version;
        if (impl && version) {
          pythonVersion = `${impl} ${version}`;
        }
        break;
      }

      default:
        break;
    }
  }

  const httpTotalRequests = Array.from(httpRequestTypeMap.values()).reduce(
    (acc, v) => acc + v,
    0
  );

  const http: ParsedHttpMetrics = {
    totalRequests: httpTotalRequests,
    handlers: Array.from(httpHandlerMap.entries()).map(([handler, requests]) => ({
      handler,
      requests,
    })),
    methods: Array.from(httpMethodMap.entries()).map(([method, count]) => ({
      method,
      count,
    })),
    status: Array.from(httpStatusMap.entries()).map(([status, count]) => ({
      status,
      count,
    })),
    requestTypes: Array.from(httpRequestTypeMap.entries()).map(([request_type, count]) => ({
      request_type,
      count,
    })),
    httpStatusBreakdown: Array.from(httpStatusBreakdownMap.entries()).map(([key, value]) => ({
      status_code: key.split('_')[0],
      method: value.method,
      count: value.count,
    })),
  };

  const latency: ParsedLatencyMetrics = {
    highResBuckets: latencyBuckets,
    highResCount: latencyHighResCount,
    highResSum: latencyHighResSum,
  };

  const gc: ParsedGcMetrics = {
    collections: Array.from(gcCollectionsMap.entries()).map(([generation, count]) => ({
      generation,
      count,
    })),
    uncollectable: Array.from(gcUncollectableMap.entries()).map(([generation, count]) => ({
      generation,
      count,
    })),
  };

  const transfer: ParsedTransferSizeMetrics = {
    handlers: Array.from(transferHandlers.entries()).map(([handler, v]) => ({
      handler,
      requestCount: v.reqCount,
      requestSumBytes: v.reqSum,
      responseCount: v.resCount,
      responseSumBytes: v.resSum,
    })),
  };

  const functions: ParsedFunctionMetrics = {
    functions: Array.from(functionCallMap.entries()).map(([name, calls]) => {
      const count = functionDurationCount.get(name) ?? 0;
      const sum = functionDurationSum.get(name) ?? 0;
      const avgDurationSeconds = count > 0 ? sum / count : null;
      const status = functionStatusMap.get(name) ?? 'unknown';
      return { name, calls, avgDurationSeconds, status };
    }),
  };

  return {
    raw,
    http,
    latency,
    gc,
    transfer,
    functions,
    pythonVersion,
    tenantId,
    systemMetrics: {
      cpuUsage: systemCpuUsage,
      memoryUsage: systemMemoryUsage,
      totalErrors,
      avgResponseTime,
    },
    functionErrors: Array.from(functionErrorMap.entries()).map(([function_name, error]) => ({
      function_name,
      error_type: error.error_type,
      count: error.count,
    })),
  };
};
