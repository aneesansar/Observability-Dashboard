/**
 * API Client
 * 
 * Centralized API client using Axios with interceptors for
 * authentication, error handling, and request/response transformation.
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants';
import keycloak from '@/auth/keycloak';
import { getCurrentTenant } from '@/utils/tenant.utils';

/**
 * Create and configure Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-id': 'test_tenant',
    },
  });

  // Request interceptor - Add auth token and tenant ID
  client.interceptors.request.use(
    (config) => {
      // Add auth token from Keycloak
      const token = keycloak.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Automatically extract and set tenant from Keycloak roles
      const tenant = getCurrentTenant();
      config.headers['x-tenant-id'] = tenant;
      
      return config;
    },
    (error) => {
      try {
        const status = error.response?.status ?? 0;
        const headers = (error.config?.headers || {}) as Record<string, unknown>;
        const custom = (headers['x-feedback-error-message'] || headers['X-Feedback-Error-Message']) as string | undefined;
        const message =
          custom ||
          error.response?.data?.message ||
          error.message ||
          'Request failed';
        window.dispatchEvent(
          new CustomEvent('app-feedback', {
            detail: { status, message },
          })
        );
      } catch {}
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle success and errors globally
  client.interceptors.response.use(
    (response) => {
      try {
        const headers = (response.config.headers || {}) as Record<string, unknown>;
        const custom = (headers['x-feedback-message'] || headers['X-Feedback-Message']) as string | undefined;
        const method = (response.config.method || '').toUpperCase();
        let message: string | null = custom ?? null;
        if (!message) {
          if (method === 'POST') message = 'Created successfully';
          if (method === 'PUT' || method === 'PATCH') message = 'Updated successfully';
          if (method === 'DELETE') message = 'Deleted successfully';
        }
        if (message) {
          window.dispatchEvent(
            new CustomEvent('app-feedback', {
              detail: { status: response.status ?? 200, message },
            })
          );
        }
      } catch {}
      return response;
    },
    (error) => {
      if (error.response) {
        const { status } = error.response;
        
        switch (status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('authToken');
            window.location.href = '/login';
            break;
          case 403:
            console.error('Forbidden: You do not have permission to access this resource');
            break;
          case 404:
            console.error('Not Found: The requested resource does not exist');
            break;
          case 500:
            console.error('Server Error: An internal server error occurred');
            break;
          default:
            console.error(`API Error ${status}:`, error.response.data);
        }
      } else if (error.request) {
        console.error('Network Error: No response received from server');
      } else {
        console.error('Request Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Axios instance with interceptors
 */
export const apiClient = createApiClient();

/**
 * Generic API methods with type safety
 */
export const api = {
  /**
   * GET request
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  },

  /**
   * Upload file
   */
  upload: async <T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: unknown) => void
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  /**
   * Download file
   */
  download: async (url: string, filename: string): Promise<void> => {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  },
};
