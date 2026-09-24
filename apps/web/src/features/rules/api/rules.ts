import { api } from '@/lib/api';

export interface LifeSavingRuleStats {
  code: string;
  name: string;
  area: string;
  reportCount: number;
  sifCount: number;
  sifRate: number;
}

export const getRulesStats = async (): Promise<{ data: LifeSavingRuleStats[] }> => {
  const { data } = await api.get('/rules');
  return data;
};
