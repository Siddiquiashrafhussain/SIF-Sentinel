import { useQuery } from '@tanstack/react-query';
import { getReports, getReportById } from '../api/reports';

export function useReports(params: Record<string, string | number>) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => getReports(params),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => getReportById(id),
    enabled: !!id,
  });
}
