import { SifAnalysis } from '@/features/analytics/components/SifAnalysis';

export default function SifAnalysisPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <header>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">SIF Analysis</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          Deep dive into Serious Injury and Fatality potential detected by AI models across the organization.
        </p>
      </header>
      <SifAnalysis />
    </div>
  );
}
