'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';

export function ReportsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');

  // Update URL function
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // reset page
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter('q', q);
  };

  const clearAll = () => {
    setQ('');
    router.push(pathname);
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-[var(--color-surface-1)] border-b border-[var(--color-border-subtle)] rounded-t-lg">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border-default)] rounded-[var(--radius-md)] bg-[var(--color-background-base)] min-w-[200px] flex-1 md:flex-none">
          <Search className="h-4 w-4 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search reports..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--color-text-secondary)]"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        
        <select 
          className="text-sm border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-2 py-1.5 bg-transparent outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          value={searchParams.get('type') || ''}
          onChange={(e) => setFilter('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="NEAR_MISS">Near Miss</option>
          <option value="UNSAFE_ACT">Unsafe Act</option>
          <option value="UNSAFE_CONDITION">Unsafe Condition</option>
          <option value="INCIDENT">Incident</option>
        </select>

        <select 
          className="text-sm border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-2 py-1.5 bg-transparent outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          value={searchParams.get('sif') || ''}
          onChange={(e) => setFilter('sif', e.target.value)}
        >
          <option value="">All SIF</option>
          <option value="NON_SIF">Non-SIF</option>
          <option value="SIF_POTENTIAL">SIF Potential</option>
          <option value="HIGH_SIF">High SIF</option>
          <option value="CRITICAL_SIF">Critical SIF</option>
        </select>

        <select 
          className="text-sm border border-[var(--color-border-default)] rounded-[var(--radius-md)] px-2 py-1.5 bg-transparent outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          value={searchParams.get('status') || ''}
          onChange={(e) => setFilter('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
        </select>

        <Button variant="outlined" size="compact" onClick={clearAll} className="ml-auto text-xs">
          Clear Filters
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outlined" size="compact" onClick={() => router.push(`${pathname}?status=PENDING&sif=HIGH_SIF`)}>Needs Review (High SIF)</Button>
        <Button variant="outlined" size="compact" onClick={() => router.push(`${pathname}?sif=CRITICAL_SIF`)}>Critical</Button>
      </div>
    </div>
  );
}
