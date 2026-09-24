'use client';
import { useOverview } from '@/features/analytics/hooks/useAnalytics';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { KpiCard } from '@/components/ui/KpiCard';
import { AlertTriangle, Activity, ShieldAlert } from 'lucide-react';

export function SifAnalysis() {
  const { data: overview, isLoading } = useOverview();

  if (isLoading) {
    return <div className="p-8 text-center">Loading SIF data...</div>;
  }

  const sifDistribution = overview?.data?.sifDistribution || [];
  const kpis = overview?.data?.kpis;

  const COLORS: Record<string, string> = {
    NON_SIF: 'var(--color-severity-low)',
    SIF_POTENTIAL: 'var(--color-severity-medium)',
    HIGH_SIF: 'var(--color-severity-high)',
    CRITICAL_SIF: 'var(--color-severity-critical)',
  };

  const chartData = sifDistribution.map(d => ({
    name: d.class.replace('_', ' '),
    value: d.count,
    color: COLORS[d.class] || 'var(--color-text-secondary)',
  }));

  const criticalCount = sifDistribution.find(d => d.class === 'CRITICAL_SIF')?.count || 0;
  const highCount = sifDistribution.find(d => d.class === 'HIGH_SIF')?.count || 0;
  const potentialCount = sifDistribution.find(d => d.class === 'SIF_POTENTIAL')?.count || 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard 
          title="Critical SIFs" 
          value={criticalCount.toLocaleString()} 
          icon={<ShieldAlert />} 
          severity="critical"
        />
        <KpiCard 
          title="High SIFs" 
          value={highCount.toLocaleString()} 
          icon={<AlertTriangle />} 
          severity="high"
        />
        <KpiCard 
          title="SIF Potential" 
          value={potentialCount.toLocaleString()} 
          icon={<Activity />} 
          severity="medium"
        />
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-6 font-display text-lg">AI Inference Distribution</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--color-text-primary)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
