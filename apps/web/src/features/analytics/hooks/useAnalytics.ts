import { useQuery } from '@tanstack/react-query';
import { getOverview, getSifTrend, getBySite, getByActivity } from '../api/analytics';

export function useOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => getOverview(),
  });
}

export function useSifTrend() {
  return useQuery({
    queryKey: ['dashboard', 'sif-trend'],
    queryFn: () => getSifTrend(),
  });
}

export function useBySite() {
  return useQuery({
    queryKey: ['dashboard', 'by-site'],
    queryFn: () => getBySite(),
  });
}

export function useByActivity() {
  return useQuery({
    queryKey: ['dashboard', 'by-activity'],
    queryFn: () => getByActivity(),
  });
}
