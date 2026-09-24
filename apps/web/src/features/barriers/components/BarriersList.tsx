'use client';
import { useBarrierGaps } from '../hooks/useBarriers';
import { DataTable } from '@/components/ui/DataTable';

export function BarriersList() {
  const { data: gaps, isLoading } = useBarrierGaps();

  if (isLoading) {
    return <div className="p-8 text-center">Loading barrier statistics...</div>;
  }

  const columns = ["Code", "Barrier Name", "Class", "Tier", "Failure Frequency", "SIF Impact"];

  const tableData = gaps?.data?.map(b => ({
    "Code": <span className="font-mono text-xs font-bold text-[var(--color-primary)]">{b.code}</span>,
    "Barrier Name": <span className="font-medium">{b.name}</span>,
    "Class": <span className="text-xs">{b.class}</span>,
    "Tier": <span className="text-xs px-2 py-1 bg-[var(--color-surface-2)] rounded-full text-[var(--color-text-secondary)]">{b.tier}</span>,
    "Failure Frequency": <span className="font-mono">{b.associatedReportCount.toLocaleString()}</span>,
    "SIF Impact": (
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold text-[var(--color-severity-high)]">{b.sifRelatedReportCount.toLocaleString()}</span>
        <span className="text-xs text-[var(--color-text-secondary)] ml-2">
          {b.associatedReportCount > 0 ? ((b.sifRelatedReportCount / b.associatedReportCount) * 100).toFixed(1) : 0}% of failures lead to SIF
        </span>
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
