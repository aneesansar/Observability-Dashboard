import { apiClient } from './api.client';

// Types for RAG Query
export type RagSchedule = {
  start_date: string;
  end_date: string;
  price: string;
  airport: string | null;
};

export type RagResultItem = {
  name: string;
  url: string;
  country: string;
  trip_id: string | null;
  trip_duration: number;
  provider: string;
  description: string | null;
  score: number;
  schedules: RagSchedule[];
};

export type RagQueryResult = {
  tenant_id: string;
  query: string;
  retrieved_count: number;
  has_filters: boolean;
};

export type RagSource = {
  title: string;
  provider: string;
  score: number;
};

export type RagQueryResponse = {
  text_explanation: string;
  answer: string;
  results: RagResultItem[];
  reasoning: string[];
  query_result: RagQueryResult;
  sources: RagSource[];
  conversation_id?: string;
};

export type RagQueryRequest = {
  query: string;
  top_k?: number;
};

/**
 * RAG API Service
 * Handles RAG query operations
 */
export const ragService = {
  /**
   * Query the RAG system
   */
  async query(request: RagQueryRequest): Promise<RagQueryResponse> {
    const response = await apiClient.post<RagQueryResponse>('/api/v1/rag/query', {
      query: request.query,
      top_k: request.top_k ?? 5,
    });
    return response.data;
  },
};
