import { api } from '@/lib/api';

export interface Report {
  id: string;
  reportCode: string;
  type: 'NEAR_MISS' | 'UNSAFE_ACT' | 'UNSAFE_CONDITION' | 'INCIDENT';
  occurredAt: string;
  status: 'PENDING' | 'VERIFIED';
  asset: { name: string; site: { name: string } };
  activity: { name: string };
  aiInferences: { sifClass: string; confidence: number }[];
  reportLsrs?: { lifeSavingRule: { code: string; name: string } }[];
  barrierGaps?: { barrier: { code: string; name: string } }[];
  freeText?: string;
  source?: string;
  shift?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export const getReports = async (params: Record<string, string | number>): Promise<PaginatedResponse<Report>> => {
  const { data } = await api.get('/reports', { params });
  return data;
};

export const getReportById = async (id: string): Promise<{ data: Report }> => {
  const { data } = await api.get(`/reports/${id}`);
  return data;
};
