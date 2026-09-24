import { api } from '@/lib/api';

export interface DashboardOverview {
  kpis: {
    totalReports: number;
    sifPotential: number;
    critical: number;
    pendingReview: number;
  };
  sifDistribution: { class: string; count: number }[];
  topActivities: { activityName: string; count: number }[];
  siteCounts: { siteName: string; count: number }[];
}

export const getOverview = async (): Promise<{ data: DashboardOverview }> => {
  const { data } = await api.get('/analytics/overview');
  return data;
};

export interface SifTrend {
  period: string;
  totalReports: number;
  sifPotential: number;
}

export const getSifTrend = async (): Promise<{ data: SifTrend[] }> => {
  const { data } = await api.get('/analytics/sif-trend');
  return data;
};

export interface SiteAnalytics {
  siteId: string;
  siteName: string;
  totalReports: number;
  sifReports: number;
  sifRate: number;
}

export const getBySite = async (): Promise<{ data: SiteAnalytics[] }> => {
  const { data } = await api.get('/analytics/by-site');
  return data;
};

export interface ActivityAnalytics {
  activity: string;
  totalReports: number;
  sifReports: number;
  sifRate: number;
}

export const getByActivity = async (): Promise<{ data: ActivityAnalytics[] }> => {
  const { data } = await api.get('/analytics/by-activity');
  return data;
};
