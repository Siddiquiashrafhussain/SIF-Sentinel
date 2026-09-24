import * as React from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, AlertTriangle, FileText, Activity, Shield, Layers, Network, MapPin } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

const navItems = [
  { icon: LayoutDashboard, label: "Home Dashboard", href: "/" },
  { icon: FileText, label: "Safety Reports", href: "/reports" },
  { icon: Shield, label: "Review Queue", href: "/review", badge: "!" },
  { icon: AlertTriangle, label: "SIF Analysis", href: "/sif-analysis" },
  { icon: Activity, label: "Life-Saving Rules", href: "/life-saving-rules" },
  { icon: Layers, label: "Barrier Gaps", href: "/barriers" },
  { icon: Network, label: "Precursor Patterns", href: "/patterns" },
  { icon: MapPin, label: "Sites & Activities", href: "/sites" },
];

export function Sidebar({ collapsed = false, className, ...props }: SidebarProps) {
  const { user } = useAuth();
  
  const filteredNavItems = navItems.filter((item) => {
    if (item.label === "Review Queue" && user?.role !== "HSE_OFFICER") {
      return false;
    }
    return true;
  });

  return (
    <aside
      className={cn(
        "bg-[var(--color-surface-1)] border-r border-[var(--color-border-subtle)] flex flex-col transition-all duration-300 z-20",
        collapsed ? "w-[64px]" : "w-[240px]",
        className
      )}
      {...props}
    >
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {filteredNavItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link 
              key={i} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-2)] transition-colors group relative",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium text-sm flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="bg-[var(--color-severity-critical)] text-[var(--color-text-inverse)] text-[10px] font-bold px-1.5 py-0.5 rounded-[var(--radius-sm)] min-w-[1.25rem] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {!collapsed && (
        <div className="p-4 border-t border-[var(--color-border-subtle)]">
          <div className="bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-md)] text-xs text-[var(--color-text-secondary)]">
            <p className="font-bold mb-1">System Status</p>
            <div className="flex items-center gap-1.5 text-[var(--color-severity-low)] font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--color-severity-low)]"></span>
              All sensors nominal
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
