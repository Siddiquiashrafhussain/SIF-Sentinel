import { useQuery } from '@tanstack/react-query';
import { getRulesStats } from '../api/rules';

export function useRulesStats() {
  return useQuery({
    queryKey: ['rules', 'stats'],
    queryFn: () => getRulesStats(),
  });
}
