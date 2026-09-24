import { Drawer } from '@/components/ui/Drawer';
import { useReport } from '../hooks/useReports';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { ExplainabilityPopover } from '@/components/ui/ExplainabilityPopover';
import { HSEVerifiedTag } from '@/components/ui/HSEVerifiedTag';

interface ReportDrawerProps {
  reportId: string | null;
  onClose: () => void;
  footer?: React.ReactNode;
}

export function ReportDrawer({ reportId, onClose, footer }: ReportDrawerProps) {
  const { data, isLoading, isError } = useReport(reportId || '');

  if (!reportId) return null;

  const report = data?.data;

  return (
    <Drawer isOpen={!!reportId} onClose={onClose} title="Report Details">
      {isLoading ? (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-24 bg-[var(--color-surface-2)] rounded-lg"></div>
          <div className="h-48 bg-[var(--color-surface-2)] rounded-lg"></div>
        </div>
      ) : isError || !report ? (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-sm">Failed to load report details.</div>
      ) : (
        <div className="flex flex-col gap-8 pb-12">
          {/* Header section */}
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <h3 className="text-2xl font-bold font-mono tracking-tight">{report.reportCode}</h3>
              <p className="text-[var(--color-text-secondary)] mt-1">{new Date(report.occurredAt).toLocaleString()}</p>
            </div>
            <HSEVerifiedTag verified={report.status === 'VERIFIED'} />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-border-subtle)]">
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider font-semibold">Type</p>
              <p className="text-sm font-medium">{report.type.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider font-semibold">Site</p>
              <p className="text-sm font-medium">{report.asset.site.name}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider font-semibold">Asset</p>
              <p className="text-sm font-medium">{report.asset.name}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider font-semibold">Activity</p>
              <p className="text-sm font-medium">{report.activity.name}</p>
            </div>
          </div>

          {/* Observation text */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Original Observation</h4>
            <div className="bg-[var(--color-background-base)] border border-[var(--color-border-default)] p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
              {report.freeText}
            </div>
          </div>

          {/* AI Analysis */}
          {report.aiInferences?.[0] && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">AI Intelligence</h4>
              <div className="border border-[var(--color-border-subtle)] rounded-xl overflow-hidden">
                <div className="bg-[var(--color-surface-2)] p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SeverityBadge 
                      severity={
                        report.aiInferences[0].sifClass === 'CRITICAL_SIF' ? 'critical' :
                        report.aiInferences[0].sifClass === 'HIGH_SIF' ? 'high' :
                        report.aiInferences[0].sifClass === 'SIF_POTENTIAL' ? 'medium' : 'low'
                      }
                    >
                      {report.aiInferences[0].sifClass.replace('_', ' ')}
                    </SeverityBadge>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {(report.aiInferences[0].confidence * 100).toFixed(1)}% Confidence
                    </span>
                  </div>
                  <ExplainabilityPopover 
                    explanation={{
                      sifClass: report.aiInferences[0].sifClass,
                      confidence: report.aiInferences[0].confidence,
                      topDrivers: Object.values((report.aiInferences[0] as any).topDrivers)[0] as any,
                      modelDetails: {
                        version: 'v1.0.0-synthetic',
                        inferenceTime: '120ms'
                      }
                    }} 
                  />
                </div>
                
                {/* LSRs and Barriers */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--color-surface-1)]">
                  <div>
                    <h5 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase mb-2 tracking-wider">Life-Saving Rules Exposed</h5>
                    {report.reportLsrs?.length ? (
                      <ul className="space-y-2">
                        {report.reportLsrs.map((lsr: any, i: number) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-severity-high)]"></span>
                            {lsr.lifeSavingRule.name}
                          </li>
                        ))}
                      </ul>
                    ) : <span className="text-sm text-[var(--color-text-secondary)]">None identified.</span>}
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase mb-2 tracking-wider">Barrier Failures</h5>
                    {report.barrierGaps?.length ? (
                      <ul className="space-y-2">
                        {report.barrierGaps.map((gap: any, i: number) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-severity-medium)]"></span>
                            {gap.barrier.name}
                          </li>
                        ))}
                      </ul>
                    ) : <span className="text-sm text-[var(--color-text-secondary)]">None identified.</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Review Details if verified */}
          {report.status === 'VERIFIED' && (report as any).reviews && (report as any).reviews.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Verification Details</h4>
              <div className="bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-border-subtle)] text-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-[var(--color-text-primary)]">{(report as any).reviews[0].reviewer.name}</span>
                  <span className="text-[var(--color-text-secondary)]">{new Date((report as any).reviews[0].createdAt).toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-[var(--color-severity-low)] text-white mr-2">
                    {(report as any).reviews[0].decision}
                  </span>
                </div>
                {(report as any).reviews[0].note && (
                  <p className="mt-2 pt-2 border-t border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] italic">
                    "{(report as any).reviews[0].note}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Optional Footer (e.g. for Reviews) */}
          {footer && (
            <div className="mt-4 pt-6 border-t border-[var(--color-border-subtle)]">
              {footer}
            </div>
          )}

        </div>
      )}
    </Drawer>
  );
}
