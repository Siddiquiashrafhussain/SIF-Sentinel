'use client';
import { useReports } from '../hooks/useReports';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { HSEVerifiedTag } from '@/components/ui/HSEVerifiedTag';
import { Button } from '@/components/ui/Button';
import { ReportDrawer } from './ReportDrawer';
import { useState } from 'react';

export function ReportList() {
  const searchParams = useSearchParams();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
  
  const params: Record<string, string | number> = { page, pageSize };
  searchParams.forEach((value, key) => {
    if (value && key !== 'page' && key !== 'pageSize') params[key] = value;
  });

  const { data, isLoading, isError } = useReports(params);

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-b-lg border-x border-b border-[var(--color-border-subtle)]">
        Unable to load reports.
        <br />
        <Button variant="outlined" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const columns = [
    "Report ID", "Type", "Occurred", "Site", "Activity", "SIF Potential", "Confidence", "Status"
  ];

  const tableData = data?.data.map(r => ({
    "Report ID": <span className="font-mono text-xs">{r.reportCode}</span>,
    "Type": <span className="text-xs font-semibold">{r.type.replace('_', ' ')}</span>,
    "Occurred": <span className="text-xs">{new Date(r.occurredAt).toLocaleString()}</span>,
    "Site": <span className="text-xs">{r.asset?.site?.name}</span>,
    "Activity": <span className="text-xs">{r.activity?.name}</span>,
    "SIF Potential": r.aiInferences?.[0] ? (
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
    "Confidence": r.aiInferences?.[0] ? `${(r.aiInferences[0].confidence * 100).toFixed(1)}%` : '-',
    "Status": <HSEVerifiedTag verified={r.status === 'VERIFIED'} />,
    raw: r
  })) || [];

  return (
    <div className="border-x border-b border-[var(--color-border-subtle)] rounded-b-lg">
      <DataTable 
        columns={columns} 
        data={tableData} 
        loading={isLoading}
        onRowClick={(row) => setSelectedReportId(row.id)}
        className="border-none shadow-none rounded-t-none"
      />
      {data && data.meta && (
        <div className="p-4 bg-[var(--color-surface-1)] border-t border-[var(--color-border-subtle)] flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
          <div>
            Showing {(data.meta.page - 1) * data.meta.pageSize + 1} - {Math.min(data.meta.page * data.meta.pageSize, data.meta.total)} of {data.meta.total} reports
          </div>
          {/* Pagination controls can be added here */}
        </div>
      )}
      <ReportDrawer reportId={selectedReportId} onClose={() => setSelectedReportId(null)} />
    </div>
  );
}
