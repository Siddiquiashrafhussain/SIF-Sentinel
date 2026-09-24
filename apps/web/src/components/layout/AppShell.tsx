"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { DemoBanner } from "../ui/DemoBanner";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppShell({ children, className, ...props }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // A simplistic responsive approach for collapsed sidebar in real app would use window matchMedia
  // Here we use CSS media queries to control visibility, while React state controls mobile drawer.

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-base)] text-[var(--color-text-primary)] font-sans">
      <DemoBanner />
      <TopBar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop / Tablet Sidebar */}
        <div className="hidden md:flex">
          <div className="hidden xl:flex h-full">
            <Sidebar collapsed={false} />
          </div>
          <div className="flex xl:hidden h-full">
            <Sidebar collapsed={true} />
          </div>
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
            <Sidebar collapsed={false} className="relative z-50 h-full w-[240px] max-w-sm shadow-xl" />
          </div>
        )}
        
        {/* Main Content Area */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto w-full",
            // Padding based on layout breakpoints requested
            "p-4 md:p-6 lg:p-8",
            className
          )}
          {...props}
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
