import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Clock } from "lucide-react";

export interface HSEVerifiedTagProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "verified" | "pending";
  verified?: boolean;
}

export function HSEVerifiedTag({ status, verified, className, ...props }: HSEVerifiedTagProps) {
  const isVerified = verified !== undefined ? verified : status === "verified";
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
        isVerified 
          ? "bg-[var(--color-hse-v-bg)] text-[var(--color-hse-v-text)] border border-[var(--color-hse-v-border)]"
          : "bg-[var(--color-hse-p-bg)] text-[var(--color-hse-p-text)] border border-dashed border-[var(--color-hse-p-border)]",
        className
      )}
      {...props}
    >
      {isVerified ? <ShieldCheck className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
      <span>{isVerified ? "HSE Verified" : "HSE Pending"}</span>
    </div>
  );
}
