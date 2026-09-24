'use client';
import { ReviewList } from '@/features/review/components/ReviewList';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ReviewQueuePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  if (user?.role !== 'HSE_OFFICER') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          The Review Queue is restricted to HSE Officers. Your current role ({user?.role}) does not have permission to view or submit HSE reviews.
        </p>
        <Link href="/">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <header>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">HSE Review Queue</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Validate AI inferences for SIF potential, exposed Life-Saving Rules, and Barrier failures.
        </p>
      </header>

      <ReviewList />
    </div>
  );
}
