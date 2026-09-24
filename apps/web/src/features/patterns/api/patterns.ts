import { api } from '@/lib/api';
import { PaginatedResponse, Report } from '@/features/reports/api/reports';

export interface Pattern {
  id: string;
  name: string;
  description: string;
  reportCount: number;
  keywords: string[];
  createdAt: string;
}

export const getPatterns = async (params: Record<string, string | number>): Promise<PaginatedResponse<Pattern>> => {
  const { data } = await api.get('/patterns', { params });
  return data;
};

export const recomputePatterns = async () => {
  const { data } = await api.post('/patterns/recompute');
  return data;
};
