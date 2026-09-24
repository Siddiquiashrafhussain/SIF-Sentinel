import { api } from '@/lib/api';

export interface Site {
  id: string;
  name: string;
  region: string;
  type: string;
}

export const getSites = async (): Promise<{ data: Site[] }> => {
  const { data } = await api.get('/sites');
  return data;
};
