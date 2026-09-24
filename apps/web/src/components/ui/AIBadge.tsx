import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface AIBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function AIBadge({ label = "AI Analysis", className, ...props }: AIBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-ai-bg)] text-[var(--color-ai-text)] px-2 py-1 text-xs font-medium border border-transparent shadow-sm",
        className
      )}
      {...props}
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}
