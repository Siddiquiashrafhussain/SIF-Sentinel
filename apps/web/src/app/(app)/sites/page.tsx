import { SitesAnalytics } from '@/features/sites/components/SitesAnalytics';

export default function SitesPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <header>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Sites & Activities</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Geographic and operational distribution of serious injury precursors.
        </p>
      </header>
      <SitesAnalytics />
    </div>
  );
}
