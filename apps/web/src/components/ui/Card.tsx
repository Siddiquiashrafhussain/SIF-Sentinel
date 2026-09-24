import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: "1" | "2" | "3";
}

export function Card({ level = "1", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] transition-shadow",
        {
          "border border-[var(--color-border-subtle)] shadow-[var(--shadow-level-1)]": level === "1",
          "border border-[var(--color-border-default)] shadow-[var(--shadow-level-2)]": level === "2",
          "border border-[var(--color-border-strong)] shadow-[var(--shadow-level-3)]": level === "3",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
