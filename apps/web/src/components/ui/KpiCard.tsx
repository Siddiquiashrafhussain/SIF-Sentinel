import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  icon?: React.ReactNode;
  loading?: boolean;
  severity?: string;
}

export function KpiCard({ title, value, description, trend, icon, loading, className, ...props }: KpiCardProps) {
  return (
    <Card level="1" className={cn("p-4 flex flex-col gap-2", className)} {...props}>
      <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        {icon && <div className="text-[var(--color-text-secondary)] opacity-80">{icon}</div>}
      </div>
      <div className="mt-1">
        {loading ? (
          <div className="h-8 w-24 bg-[var(--color-surface-2)] animate-pulse rounded"></div>
        ) : (
          <div className="text-2xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
            {value}
          </div>
        )}
      </div>
      {(description || trend) && (
        <div className="text-xs text-[var(--color-text-secondary)] mt-1 flex items-center gap-2">
          {trend && (
            <span className={trend.positive ? "text-[var(--color-severity-low)]" : "text-[var(--color-severity-critical)]"}>
              {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          )}
          <span>{description || trend?.label}</span>
        </div>
      )}
    </Card>
  );
}
