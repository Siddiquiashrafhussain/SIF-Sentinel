import { useQuery } from '@tanstack/react-query';
import { getBarrierGaps } from '../api/barriers';

export function useBarrierGaps() {
  return useQuery({
    queryKey: ['barriers', 'gaps'],
    queryFn: () => getBarrierGaps(),
  });
}
