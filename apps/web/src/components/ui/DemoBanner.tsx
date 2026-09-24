import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export interface DemoBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function DemoBanner({ message = "DEMO DATA, NOT OIL PRODUCTION DATA", className, ...props }: DemoBannerProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify center gap-2 bg-[var(--color-severity-medium)] text-[var(--color-text-inverse)] py-1.5 px-4 text-xs font-bold tracking-widest uppercase shadow-md relative z-50",
        className
      )}
      {...props}
    >
      <AlertTriangle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
