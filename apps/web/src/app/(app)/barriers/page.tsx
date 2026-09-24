import { BarriersList } from '@/features/barriers/components/BarriersList';

export default function BarriersPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <header>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Barrier Gap Analysis</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Analysis of Swiss Cheese Model barrier failures mapped from AI safety observations.
        </p>
      </header>
      <BarriersList />
    </div>
  );
}
