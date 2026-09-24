import { PatternsList } from '@/features/patterns/components/PatternsList';

export default function PatternsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <header>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Precursor Patterns</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          AI-identified unstructured text clusters representing recurring safety precursors.
        </p>
      </header>
      <PatternsList />
    </div>
  );
}
