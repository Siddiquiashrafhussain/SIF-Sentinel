'use client';
import { useReviewQueue } from '../hooks/useReview';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { HSEVerifiedTag } from '@/components/ui/HSEVerifiedTag';
import { ReportDrawer } from '@/features/reports/components/ReportDrawer';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ReviewActionForm } from './ReviewActionForm';
import { Drawer } from '@/components/ui/Drawer';

export function ReviewList() {
  const searchParams = useSearchParams();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
  
  const { data, isLoading, isError } = useReviewQueue({ page, pageSize });

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
        Unable to load review queue.
      </div>
    );
  }

  const columns = [
    "Report ID", "Type", "Site", "Activity", "AI Classification", "Status"
  ];

  const tableData = data?.data.map(r => ({
    "Report ID": <span className="font-mono text-xs">{r.reportCode}</span>,
    "Type": <span className="text-xs font-semibold">{r.type.replace('_', ' ')}</span>,
    "Site": <span className="text-xs">{r.asset?.site?.name}</span>,
    "Activity": <span className="text-xs">{r.activity?.name}</span>,
    "AI Classification": r.aiInferences?.[0] ? (
      <SeverityBadge 
        severity={
          r.aiInferences[0].sifClass === 'CRITICAL_SIF' ? 'critical' :
          r.aiInferences[0].sifClass === 'HIGH_SIF' ? 'high' :
          r.aiInferences[0].sifClass === 'SIF_POTENTIAL' ? 'medium' : 'low'
        }
      >
        {r.aiInferences[0].sifClass.replace('_', ' ')}
      </SeverityBadge>
    ) : '-',
    "Status": <HSEVerifiedTag verified={r.status === 'VERIFIED'} />,
    raw: r
  })) || [];

  return (
    <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-xl">
      <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-[var(--color-text-primary)]">Pending Reviews</h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">Reports awaiting HSE validation</p>
        </div>
        {data && (
          <div className="text-sm font-medium px-3 py-1 bg-[var(--color-surface-2)] rounded-full">
            {data.meta.total} remaining
          </div>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={tableData} 
        loading={isLoading}
        onRowClick={(row) => setSelectedReportId(row.id)}
        className="border-none shadow-none rounded-none"
      />
      
      {data && data.meta && data.meta.total > 0 && (
        <div className="p-4 bg-[var(--color-surface-1)] border-t border-[var(--color-border-subtle)] flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
          <div>
            Showing {(data.meta.page - 1) * data.meta.pageSize + 1} - {Math.min(data.meta.page * data.meta.pageSize, data.meta.total)} of {data.meta.total} reports
          </div>
        </div>
      )}

      {/* When a report is selected from the queue, we show the drawer AND the review form */}
      {selectedReportId && (
        <ReportDrawer 
          reportId={selectedReportId} 
          onClose={() => setSelectedReportId(null)} 
          footer={<ReviewActionForm reportId={selectedReportId} onSuccess={() => setSelectedReportId(null)} />}
        />
      )}
    </div>
  );
}
