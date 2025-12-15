/**
 * API Configuration Constants
 * 
 * Centralized API-related constants for the application.
 */

export const API_BASE_URL = 'http://localhost:8001' as const;
export const API_TIMEOUT = 30000 as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  FEEDBACK: '/api/v1/feedback',
  FEEDBACK_STATS: '/api/v1/feedback/stats/summary',
  DOCUMENTS_STATS: '/api/v1/documents/stats/summary',
  AUTH: '/api/v1/auth',
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;
