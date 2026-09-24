import * as React from "react";
import { cn } from "@/lib/utils";

type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

export interface SeverityBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  severity: SeverityLevel;
}

const severityConfig: Record<SeverityLevel, string> = {
  critical: "bg-[rgba(220,38,38,0.12)] text-[var(--color-severity-critical)] border-[rgba(220,38,38,0.3)]",
  high: "bg-[rgba(234,88,12,0.12)] text-[var(--color-severity-high)] border-[rgba(234,88,12,0.3)]",
  medium: "bg-[rgba(217,119,6,0.12)] text-[var(--color-severity-medium)] border-[rgba(217,119,6,0.3)]",
  low: "bg-[rgba(22,163,74,0.12)] text-[var(--color-severity-low)] border-[rgba(22,163,74,0.3)]",
  info: "bg-[rgba(37,99,235,0.12)] text-[var(--color-severity-info)] border-[rgba(37,99,235,0.3)]",
};

export function SeverityBadge({ severity, className, children, ...props }: SeverityBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[var(--radius-md)] border px-2.5 py-0.5 text-xs font-semibold font-mono",
        severityConfig[severity],
        className
      )}
      {...props}
    >
      {children || severity.toUpperCase()}
    </div>
  );
}
