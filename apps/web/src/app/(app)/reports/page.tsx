import { ReportsFilterBar } from '@/features/reports/components/ReportsFilterBar';
import { ReportList } from '@/features/reports/components/ReportList';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <header>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Safety Reports</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Browse and filter ingested safety observations, near misses, and incidents.
        </p>
      </header>

      <div className="flex flex-col w-full bg-[var(--color-surface-1)] rounded-xl shadow-sm border border-[var(--color-border-subtle)]">
        <ReportsFilterBar />
        <ReportList />
      </div>
    </div>
  );
}
