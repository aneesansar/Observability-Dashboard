import { apiClient } from './api.client';

// Types for Feedback
export type CreateFeedbackPayload = {
  conversation_id: string;
  feedback: string;
  metadata?: Record<string, unknown>;
  rating: boolean;
  reason?: string;
  suggested_answer?: string;
};

export type FeedbackResponse = {
  id: string;
  conversation_id: string;
  tenant_id: string;
  feedback: string;
  reason: string;
  suggested_answer: string;
  rating: boolean;
  timestamp: string;
  trace_updated: boolean;
  message: string;
};

/**
 * Feedback API Service
 * Handles feedback operations
 */
export const feedbackService = {
  /**
   * Create new feedback
   */
  async create(payload: CreateFeedbackPayload, tenantId?: string): Promise<FeedbackResponse> {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }
    
    const response = await apiClient.post<FeedbackResponse>('/api/v1/feedback', payload, {
      headers,
    });
    return response.data;
  },
};
