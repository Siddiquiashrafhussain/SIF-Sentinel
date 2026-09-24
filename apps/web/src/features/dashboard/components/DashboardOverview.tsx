'use client';
import { useOverview, useSifTrend } from '@/features/analytics/hooks/useAnalytics';
import { useRulesStats } from '@/features/rules/hooks/useRules';
import { useReports } from '@/features/reports/hooks/useReports';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { AlertTriangle, FileText, Activity, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ReportDrawer } from '@/features/reports/components/ReportDrawer';
import { useState } from 'react';

export function DashboardOverview() {
  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: trend, isLoading: trendLoading } = useSifTrend();
  const { data: rules, isLoading: rulesLoading } = useRulesStats();
  const { data: recentReports, isLoading: reportsLoading } = useReports({ pageSize: 5 });
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  if (overviewLoading || trendLoading || rulesLoading || reportsLoading) {
    return <div className="p-8 text-center text-[var(--color-text-secondary)]">Loading dashboard data...</div>;
  }

  const kpis = overview?.data?.kpis;
  const recentTableData = recentReports?.data?.map(r => ({
    "Report ID": <span className="font-mono text-xs">{r.reportCode}</span>,
    "Type": <span className="text-xs font-semibold">{r.type.replace('_', ' ')}</span>,
    "Site": <span className="text-xs">{r.asset?.site?.name}</span>,
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
    raw: r
  })) || [];

  return (
    <div className="flex flex-col gap-6 w-full">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">Safety Intelligence</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Enterprise overview of safety reporting and AI-detected SIF potential.
          </p>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Reports" 
          value={kpis?.totalReports?.toLocaleString() || "0"} 
          trend={{ value: 12, label: "from last month", positive: true }} 
          icon={<FileText />} 
        />
        <KpiCard 
          title="SIF Potential Detected" 
          value={kpis?.sifPotential?.toLocaleString() || "0"} 
          trend={{ value: 5, label: "vs last month", positive: false }}
          icon={<AlertTriangle />} 
        />
        <KpiCard 
          title="Critical SIF Events" 
          value={kpis?.critical?.toLocaleString() || "0"} 
          severity="high"
          icon={<Activity />} 
        />
        <KpiCard 
          title="Pending HSE Review" 
          value={kpis?.pendingReview?.toLocaleString() || "0"} 
          icon={<CheckCircle2 />} 
          severity={kpis?.pendingReview && kpis.pendingReview > 50 ? 'medium' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 p-5 flex flex-col min-h-[350px]">
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-6 font-display">SIF Trends over Time</h3>
          <div className="flex-1 w-full relative">
            {trend?.data && (
              <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                <AreaChart data={trend.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSif" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-severity-high)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-severity-high)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
                  <XAxis dataKey="period" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                  />
                  <Area type="monotone" dataKey="sifPotential" name="SIF Potential" stroke="var(--color-severity-high)" strokeWidth={2} fillOpacity={1} fill="url(#colorSif)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Top LSR Failures */}
        <Card className="p-5 flex flex-col min-h-[350px]">
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-6 font-display">Top Life-Saving Rule Breaches</h3>
          <div className="flex-1 w-full relative">
            {rules?.data && (
              <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                <BarChart data={rules.data.sort((a,b) => b.sifCount - a.sifCount).slice(0, 5)} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border-subtle)" />
                  <XAxis type="number" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="code" type="category" stroke="var(--color-text-primary)" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-surface-2)' }}
                    contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="sifCount" name="SIF Inferences" fill="var(--color-severity-high)" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)] font-display">Recent Reports</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Latest safety observations ingested by SIF-Sentinel</p>
          </div>
          <Link href="/reports">
            <Button variant="outlined" size="compact">View All</Button>
          </Link>
        </div>
        <DataTable 
          columns={["Report ID", "Type", "Site", "SIF Potential"]} 
          data={recentTableData} 
          density="compact"
          onRowClick={(row) => setSelectedReportId(row.id)}
          className="border-none shadow-none rounded-none"
        />
      </Card>
      <ReportDrawer reportId={selectedReportId} onClose={() => setSelectedReportId(null)} />
    </div>
  );
}
