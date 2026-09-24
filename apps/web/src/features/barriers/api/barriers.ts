import { api } from '@/lib/api';

export interface BarrierGap {
  code: string;
  name: string;
  class: string;
  tier: string;
  associatedReportCount: number;
  sifRelatedReportCount: number;
}

export const getBarrierGaps = async (): Promise<{ data: BarrierGap[] }> => {
  const { data } = await api.get('/barriers/gaps');
  return data;
};
