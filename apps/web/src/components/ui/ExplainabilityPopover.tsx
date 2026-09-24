"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Info, X } from "lucide-react";
import { Card } from "./Card";
import { AIBadge } from "./AIBadge";

export interface ExplainabilityPopoverProps {
  title?: string;
  evidence?: string;
  metadata?: Record<string, string>;
  explanation?: any;
  children?: React.ReactNode;
}

export function ExplainabilityPopover({ title, evidence, metadata, explanation, children }: ExplainabilityPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const displayTitle = title || (explanation ? "AI Intelligence Explanation" : "Explanation");
  const displayEvidence = evidence || (explanation ? JSON.stringify(explanation, null, 2) : "");

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex">
        {children || <Info className="h-4 w-4 text-[var(--color-primary)]" />}
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <Card 
            level="3" 
            className="absolute z-50 top-full mt-2 left-0 w-80 p-4 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <AIBadge label="AI Analysis" />
                <h4 className="font-bold text-sm text-[var(--color-text-primary)]">{displayTitle}</h4>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider">Evidence</h5>
              <p className="text-sm bg-[var(--color-surface-2)] p-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] italic whitespace-pre-wrap">
                {displayEvidence}
              </p>
            </div>
            
            {metadata && (
              <div className="space-y-2">
                {Object.entries(metadata).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--color-text-secondary)]">{k}:</span>
                    <span className="font-mono text-[var(--color-text-primary)]">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
