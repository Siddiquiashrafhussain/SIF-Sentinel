import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviewQueue, getNeedsAttention, submitReview, SubmitReviewPayload } from '../api/review';

export function useReviewQueue(params: Record<string, string | number>) {
  return useQuery({
    queryKey: ['review-queue', params],
    queryFn: () => getReviewQueue(params),
  });
}

export function useNeedsAttention() {
  return useQuery({
    queryKey: ['needs-attention'],
    queryFn: () => getNeedsAttention(),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reportId, payload }: { reportId: string, payload: SubmitReviewPayload }) => submitReview(reportId, payload),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['review-queue'] });
      queryClient.invalidateQueries({ queryKey: ['needs-attention'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      // Invalidate the specific report
      queryClient.invalidateQueries({ queryKey: ['reports', variables.reportId] });
    },
  });
}
