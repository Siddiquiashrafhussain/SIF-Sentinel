'use client';
import { useBySite, useByActivity } from '@/features/analytics/hooks/useAnalytics';
import { DataTable } from '@/components/ui/DataTable';
import { Card } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SitesAnalytics() {
  const { data: sitesData, isLoading: sitesLoading } = useBySite();
  const { data: activitiesData, isLoading: activitiesLoading } = useByActivity();

  if (sitesLoading || activitiesLoading) {
    return <div className="p-8 text-center">Loading analytics data...</div>;
  }

  const columns = ["Site Name", "Total Reports", "SIF Potential", "SIF Rate"];

  const tableData = sitesData?.data?.map(s => ({
    "Site Name": <span className="font-semibold">{s.siteName}</span>,
    "Total Reports": <span className="font-mono">{s.totalReports.toLocaleString()}</span>,
    "SIF Potential": <span className="font-mono font-semibold text-[var(--color-severity-high)]">{s.sifReports.toLocaleString()}</span>,
    "SIF Rate": (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--color-severity-high)]" 
            style={{ width: `${Math.min(s.sifRate * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs font-mono">{(s.sifRate * 100).toFixed(1)}%</span>
      </div>
    ),
  })) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[var(--color-border-subtle)]">
            <h3 className="font-semibold text-[var(--color-text-primary)] font-display">Global Asset Map</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">SIF rates by physical site</p>
          </div>
          <DataTable 
            columns={columns} 
            data={tableData} 
            loading={sitesLoading}
            className="border-none shadow-none rounded-none"
          />
        </Card>

        <Card className="p-5 flex flex-col min-h-[400px]">
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-1 font-display">High-Risk Activities</h3>
          <p className="text-xs text-[var(--color-text-secondary)] mb-6">Operations producing the most SIF precursors</p>
          <div className="flex-1 w-full relative">
            {activitiesData?.data && (
              <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                <BarChart data={activitiesData.data.sort((a,b) => b.sifReports - a.sifReports).slice(0, 10)} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border-subtle)" />
                  <XAxis type="number" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="activity" type="category" stroke="var(--color-text-primary)" fontSize={11} fontWeight="medium" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-surface-2)' }}
                    contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="sifReports" name="SIF Reports" fill="var(--color-severity-high)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
