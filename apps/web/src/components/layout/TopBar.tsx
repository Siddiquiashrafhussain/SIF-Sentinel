import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu, User, Bell, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick, className, ...props }: TopBarProps) {
  const { user, logout } = useAuth();
  
  return (
    <header 
      className={cn(
        "h-[64px] bg-[var(--color-surface-1)] border-b border-[var(--color-border-subtle)] flex items-center justify-between px-4 sticky top-0 z-30",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-inverse)] font-bold text-lg">
            S
          </div>
          <span className="font-display font-bold text-xl text-[var(--color-text-primary)] hidden sm:block">SIF-Sentinel</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-severity-critical)]"></span>
        </button>
        <button className="p-2 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]">
          <Settings className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <div className="h-8 w-8 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-primary)] overflow-hidden" title={user?.name}>
            <User className="h-4 w-4" />
          </div>
          <button 
            onClick={() => logout()}
            className="p-2 rounded-md hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
