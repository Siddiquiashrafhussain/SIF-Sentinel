'use client';
import { useRulesStats } from '../hooks/useRules';
import { DataTable } from '@/components/ui/DataTable';

export function RulesList() {
  const { data: rules, isLoading } = useRulesStats();

  if (isLoading) {
    return <div className="p-8 text-center">Loading rules statistics...</div>;
  }

  const columns = ["Code", "Rule Name", "Category", "Reports Mapped", "SIF Potential Count", "SIF Rate"];

  const tableData = rules?.data?.map(r => ({
    "Code": <span className="font-mono text-xs font-bold text-[var(--color-primary)]">{r.code}</span>,
    "Rule Name": <span className="font-medium">{r.name}</span>,
    "Category": <span className="text-xs px-2 py-1 bg-[var(--color-surface-2)] rounded-full text-[var(--color-text-secondary)]">{r.area || 'General'}</span>,
    "Reports Mapped": <span className="font-mono">{r.reportCount.toLocaleString()}</span>,
    "SIF Potential Count": <span className="font-mono font-semibold text-[var(--color-severity-high)]">{r.sifCount.toLocaleString()}</span>,
    "SIF Rate": (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--color-severity-high)]" 
            style={{ width: `${Math.min(r.sifRate * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs font-mono">{(r.sifRate * 100).toFixed(1)}%</span>
      </div>
    ),
  })) || [];

  return (
    <div className="bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
      <DataTable 
        columns={columns} 
        data={tableData} 
        loading={isLoading}
        className="border-none shadow-none rounded-none"
      />
    </div>
  );
}
