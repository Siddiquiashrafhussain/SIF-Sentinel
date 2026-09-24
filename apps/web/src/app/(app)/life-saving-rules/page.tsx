import { RulesList } from '@/features/rules/components/RulesList';

export default function LifeSavingRulesPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <header>
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Life-Saving Rules</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          IOGP Life-Saving Rules mapped to safety observations and incidents across all sites.
        </p>
      </header>
      <RulesList />
    </div>
  );
}
