import { useQuery, useMutation } from '@tanstack/react-query';
import { getPatterns, recomputePatterns } from '../api/patterns';

export function usePatterns(params: Record<string, string | number>) {
  return useQuery({
    queryKey: ['patterns', params],
    queryFn: () => getPatterns(params),
  });
}

export function useRecomputePatterns() {
  return useMutation({
    mutationFn: recomputePatterns,
  });
}
