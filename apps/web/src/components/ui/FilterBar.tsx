import * as React from "react";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";
import { Button } from "./Button";

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  filters?: string[];
}

export function FilterBar({ filters = ["Date", "Asset", "Status"], className, ...props }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 p-3 bg-[var(--color-surface-1)] border-b border-[var(--color-border-subtle)]", className)} {...props}>
      <div className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border-default)] rounded-[var(--radius-md)] bg-[var(--color-background-base)] min-w-[200px]">
        <Search className="h-4 w-4 text-[var(--color-text-secondary)]" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--color-text-secondary)]"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-[var(--color-text-secondary)]" />
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Filters:</span>
      </div>
      
      {filters.map((f, i) => (
        <select key={i} className="text-sm border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-2 py-1.5 bg-transparent focus:ring-2 focus:ring-[var(--color-primary-active)] outline-none">
          <option>{f}</option>
        </select>
      ))}

      <Button variant="outlined" size="compact" className="ml-auto text-xs">
        Clear All
      </Button>
    </div>
  );
}
