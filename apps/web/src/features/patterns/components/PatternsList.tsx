'use client';
import { usePatterns, useRecomputePatterns } from '../hooks/usePatterns';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function PatternsList() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
  
  const { data, isLoading } = usePatterns({ page, pageSize });
  const { mutate: recompute, isPending } = useRecomputePatterns();
  const [showToast, setShowToast] = useState(false);

  const handleRecompute = () => {
    recompute(undefined, {
      onSuccess: () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    });
  };

  const columns = ["Cluster Name", "Keywords", "Report Count", "Identified On"];

  const tableData = data?.data?.map(p => ({
    "Cluster Name": <span className="font-semibold">{p.name}</span>,
    "Keywords": (
      <div className="flex flex-wrap gap-1">
        {p.keywords.slice(0, 5).map(kw => (
          <span key={kw} className="text-[10px] px-1.5 py-0.5 bg-[var(--color-surface-2)] border border-[var(--color-border-default)] rounded text-[var(--color-text-secondary)]">
            {kw}
          </span>
        ))}
        {p.keywords.length > 5 && <span className="text-[10px] text-[var(--color-text-secondary)]">+{p.keywords.length - 5}</span>}
      </div>
    ),
    "Report Count": <span className="font-mono">{p.reportCount}</span>,
    "Identified On": <span className="text-xs">{new Date(p.createdAt).toLocaleDateString()}</span>,
  })) || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button 
          variant="outlined" 
          onClick={handleRecompute} 
          disabled={isPending}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? 'animate-spin' : ''}`} />
          {isPending ? 'Queuing Job...' : 'Recompute Patterns'}
        </Button>
      </div>

      {showToast && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg text-sm flex items-center justify-between transition-opacity">
          Pattern recomputation job has been queued successfully.
        </div>
      )}

      <div className="bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
        <DataTable 
          columns={columns} 
          data={tableData} 
          loading={isLoading}
          className="border-none shadow-none rounded-none"
        />
        {data && data.meta && data.meta.total > 0 && (
          <div className="p-4 bg-[var(--color-surface-1)] border-t border-[var(--color-border-subtle)] flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
            <div>
              Showing {(data.meta.page - 1) * data.meta.pageSize + 1} - {Math.min(data.meta.page * data.meta.pageSize, data.meta.total)} of {data.meta.total} patterns
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
