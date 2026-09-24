import * as React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { AIBadge } from "@/components/ui/AIBadge";
import { HSEVerifiedTag } from "@/components/ui/HSEVerifiedTag";
import { Card } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { DataTable } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { ExplainabilityPopover } from "@/components/ui/ExplainabilityPopover";
import { Info } from "lucide-react";

export default function DesignPreview() {
  const dummyData = [
    { id: "EVT-8923", asset: "Pump Station A", severity: "critical", time: "10:23 AM" },
    { id: "EVT-8924", asset: "Flare Stack 2", severity: "high", time: "10:15 AM" },
    { id: "EVT-8925", asset: "Pipeline Sector 4", severity: "medium", time: "09:45 AM" },
    { id: "EVT-8926", asset: "Valve 12-B", severity: "low", time: "08:30 AM" },
  ];

  return (
    <AppShell>
      <div className="space-y-8 pb-20">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2 tracking-tight">Design System Preview</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl text-lg">
            A comprehensive visual check of the SIF-Sentinel UI components built exactly to design specifications.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold border-b border-[var(--color-border-subtle)] pb-2">Typography</h2>
          <div className="space-y-4">
            <div><span className="text-[2rem] font-bold font-display leading-[2.5rem] tracking-tight">Headline XL - Hanken Grotesk</span></div>
            <div><span className="text-[1.5rem] font-semibold font-display leading-[2rem]">Headline LG - Hanken Grotesk</span></div>
            <div><span className="text-[1.125rem] font-sans">Body LG - Public Sans. Used for main content and readability.</span></div>
            <div><span className="text-[0.875rem] font-sans text-[var(--color-text-secondary)]">Body MD - Public Sans. Dense telemetry and subtext.</span></div>
            <div><span className="text-[0.8125rem] font-mono font-medium">Code Mono - JetBrains Mono - 0123456789</span></div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold border-b border-[var(--color-border-subtle)] pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <Button variant="primary">Primary Action</Button>
            <Button variant="outlined">Secondary Action</Button>
            <Button variant="emergency">Emergency Stop</Button>
            <Button variant="primary" size="compact">Compact</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold border-b border-[var(--color-border-subtle)] pb-2">Severity Badges & Tags</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <SeverityBadge severity="critical">Critical</SeverityBadge>
            <SeverityBadge severity="high">High</SeverityBadge>
            <SeverityBadge severity="medium">Medium</SeverityBadge>
            <SeverityBadge severity="low">Low</SeverityBadge>
            <SeverityBadge severity="info">Info</SeverityBadge>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <AIBadge label="94.8% Confidence" />
            <AIBadge label="AI Analysis" />
            <ExplainabilityPopover 
              title="Pressure Transient" 
              evidence="Rapid pressure variance (+45 PSI/min) detected across 3 upstream sensors."
              metadata={{ "Confidence": "94.8%", "Model": "SIF-CNN-v2" }}
            >
              <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline">
                <Info className="h-4 w-4" /> Explain
              </div>
            </ExplainabilityPopover>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <HSEVerifiedTag status="verified" />
            <HSEVerifiedTag status="pending" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold border-b border-[var(--color-border-subtle)] pb-2">Elevation & Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card level="1" className="p-6">
              <h3 className="font-bold mb-2">Level 1 - Base Card</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Standard telemetry panels and metrics.</p>
            </Card>
            <Card level="2" className="p-6">
              <h3 className="font-bold mb-2">Level 2 - Hover / Focus</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Active focus areas or interactive cards.</p>
            </Card>
            <Card level="3" className="p-6">
              <h3 className="font-bold mb-2">Level 3 - Modals / Overlays</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Tooltips, explainability popovers, dialogue boxes.</p>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold border-b border-[var(--color-border-subtle)] pb-2">KPI Widgets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Active SIF Precursors" value="3" trend={{ value: 12, label: "vs last week", positive: false }} />
            <KpiCard title="HSE Pending Reviews" value="14" />
            <KpiCard title="Telemetry Coverage" value="99.8%" trend={{ value: 0.1, label: "vs yesterday", positive: true }} />
            <KpiCard title="Model Inference Time" value="124ms" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold border-b border-[var(--color-border-subtle)] pb-2">Data Grids & Filters</h2>
          <FilterBar />
          <DataTable 
            columns={["id", "asset", "severity", "time"]} 
            data={dummyData}
          />
        </section>
      </div>
    </AppShell>
  );
}
