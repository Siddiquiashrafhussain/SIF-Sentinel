'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { useSubmitReview } from '../hooks/useReview';

const schema = z.object({
  decision: z.enum(['CONFIRMED', 'OVERRIDDEN']),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ReviewActionFormProps {
  reportId: string;
  onSuccess: () => void;
}

export function ReviewActionForm({ reportId, onSuccess }: ReviewActionFormProps) {
  const { mutate, isPending } = useSubmitReview();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      decision: 'CONFIRMED',
      note: ''
    }
  });

  const decision = watch('decision');

  const onSubmit = (data: FormData) => {
    mutate({ reportId, payload: data }, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Decision</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer p-3 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-background-base)] flex-1 hover:bg-[var(--color-surface-2)]">
            <input type="radio" value="CONFIRMED" {...register('decision')} className="text-[var(--color-primary)]" />
            <span className="text-sm">Confirm AI Classification</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-3 border border-[var(--color-border-default)] rounded-lg bg-[var(--color-background-base)] flex-1 hover:bg-[var(--color-surface-2)]">
            <input type="radio" value="OVERRIDDEN" {...register('decision')} className="text-red-500" />
            <span className="text-sm">Override Classification</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Notes {decision === 'OVERRIDDEN' ? <span className="text-red-500">*</span> : <span className="text-[var(--color-text-secondary)] font-normal">(Optional)</span>}
        </label>
        <textarea 
          {...register('note')}
          className="w-full bg-[var(--color-background-base)] border border-[var(--color-border-default)] rounded-lg p-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
          rows={4}
          placeholder="Add your review notes here..."
          required={decision === 'OVERRIDDEN'}
        />
        {errors.note && <p className="text-red-500 text-xs mt-1">{errors.note.message}</p>}
      </div>

      <div className="flex justify-end pt-4 border-t border-[var(--color-border-subtle)]">
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
