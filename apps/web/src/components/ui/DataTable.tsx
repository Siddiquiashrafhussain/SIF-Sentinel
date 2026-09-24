import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: string[];
  data: any[];
  density?: "compact" | "standard";
  loading?: boolean;
  onRowClick?: (row: any) => void;
}

export function DataTable({ columns, data, density = "standard", loading, onRowClick, className, ...props }: DataTableProps) {
  return (
    <Card level="1" className={cn("overflow-hidden flex flex-col", className)} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-b border-[var(--color-border-subtle)]">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className={cn("animate-pulse", density === "compact" ? "h-[32px]" : "h-[40px]")}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-4"><div className="h-4 bg-[var(--color-surface-2)] rounded w-full max-w-[100px]"></div></td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[var(--color-text-secondary)]">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr 
                  key={i} 
                  onClick={() => onRowClick && onRowClick(row.raw || row)}
                  className={cn(
                    "transition-colors group",
                    onRowClick ? "cursor-pointer hover:bg-[var(--color-surface-2)]" : "cursor-default hover:bg-[var(--color-surface-2)]",
                    density === "compact" ? "h-[32px]" : "h-[40px]"
                  )}
                >
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 text-[var(--color-text-primary)]">
                      {row[col] !== undefined ? row[col] : "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
