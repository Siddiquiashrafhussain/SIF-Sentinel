import { api } from '@/lib/api';
import { PaginatedResponse, Report } from '@/features/reports/api/reports';

export const getReviewQueue = async (params: Record<string, string | number>): Promise<PaginatedResponse<Report>> => {
  const { data } = await api.get('/review/queue', { params });
  return data;
};

export const getNeedsAttention = async (): Promise<{ data: { count: number } }> => {
  const { data } = await api.get('/review/needs-attention');
  return data;
};

export interface SubmitReviewPayload {
  decision: 'CONFIRMED' | 'OVERRIDDEN';
  note?: string;
}

export const submitReview = async (reportId: string, payload: SubmitReviewPayload) => {
  const { data } = await api.post(`/review/${reportId}`, payload);
  return data;
};
