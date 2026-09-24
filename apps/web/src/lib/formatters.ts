export function formatSifClass(value?: string | null): string {
  if (!value) return 'Unknown';
  return value.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}

export function formatConfidence(value?: number | null): string {
  if (value === null || value === undefined) return 'Unknown';
  if (value < 0 || value > 1) return 'Invalid';
  return `${(value * 100).toFixed(1)}%`;
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString();
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleString();
}

export function formatPercentage(value?: number | null): string {
  if (value === null || value === undefined) return 'Unknown';
  if (value < 0) return 'Invalid';
  return `${value.toFixed(1)}%`;
}

export function formatReportType(value?: string | null): string {
  if (!value) return 'Unknown';
  return value.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}

export function formatReviewStatus(value?: string | null): string {
  if (!value) return 'Unknown';
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function formatLsrName(value?: string | null): string {
  return value || 'Unknown';
}

export function formatBarrierStatus(value?: string | null): string {
  if (!value) return 'Unknown';
  return value.charAt(0) + value.slice(1).toLowerCase();
}
