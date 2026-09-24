import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SifClass, ReportStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const totalReports = await this.prisma.report.count();
    
    // Group by SIF Class from AiInference
    const inferences = await this.prisma.aiInference.groupBy({
      by: ['sifClass'],
      _count: { _all: true },
    });
    
    let sifPotential = 0;
    let critical = 0;
    
    const sifDistribution = inferences.map(inf => {
      if (inf.sifClass === SifClass.SIF_POTENTIAL || inf.sifClass === SifClass.HIGH_SIF || inf.sifClass === SifClass.CRITICAL_SIF) {
        sifPotential += inf._count._all;
      }
      if (inf.sifClass === SifClass.CRITICAL_SIF) {
        critical += inf._count._all;
      }
      return { class: inf.sifClass, count: inf._count._all };
    });

    const pendingReview = await this.prisma.report.count({
      where: { status: ReportStatus.PENDING },
    });

    // Top activities
    const topActs = await this.prisma.report.groupBy({
      by: ['activityId'],
      _count: { _all: true },
      orderBy: { _count: { activityId: 'desc' } },
      take: 5,
    });
    const activities = await this.prisma.activity.findMany({
      where: { id: { in: topActs.map(a => a.activityId) } }
    });
    const topActivities = topActs.map(ta => ({
      activityName: activities.find(a => a.id === ta.activityId)?.name || 'Unknown',
      count: ta._count._all
    }));

    // Site counts
    const sCounts = await this.prisma.report.groupBy({
      by: ['assetId'], // Actually we need site, we can't groupBy across relation easily in prisma, need to fetch assets
      _count: { _all: true }
    });
    const assets = await this.prisma.asset.findMany({ include: { site: true } });
    const siteMap: Record<string, { siteName: string, count: number }> = {};
    for (const sc of sCounts) {
      const asset = assets.find(a => a.id === sc.assetId);
      if (asset) {
        if (!siteMap[asset.siteId]) siteMap[asset.siteId] = { siteName: asset.site.name, count: 0 };
        siteMap[asset.siteId].count += sc._count._all;
      }
    }
    const siteCounts = Object.values(siteMap);

    return {
      data: {
        kpis: {
          totalReports,
          sifPotential,
          critical,
          pendingReview,
        },
        sifDistribution,
        topActivities,
        siteCounts,
      }
    };
  }

  async getSifTrend() {
    // Basic implementation: grouping by month requires raw SQL in Prisma
    const res = await this.prisma.$queryRaw`
      SELECT 
        TO_CHAR(r."occurredAt", 'YYYY-MM') as period,
        COUNT(r.id)::int as "totalReports",
        SUM(CASE WHEN a."sifClass" IN ('SIF_POTENTIAL', 'HIGH_SIF', 'CRITICAL_SIF') THEN 1 ELSE 0 END)::int as "sifPotential"
      FROM "Report" r
      LEFT JOIN "AiInference" a ON r.id = a."reportId"
      GROUP BY TO_CHAR(r."occurredAt", 'YYYY-MM')
      ORDER BY period ASC
    `;
    return { data: res };
  }

  async getBySite() {
    const res = await this.prisma.$queryRaw`
      SELECT 
        s.id as "siteId",
        s.name as "siteName",
        COUNT(r.id)::int as "totalReports",
        SUM(CASE WHEN a."sifClass" IN ('SIF_POTENTIAL', 'HIGH_SIF', 'CRITICAL_SIF') THEN 1 ELSE 0 END)::int as "sifReports"
      FROM "Site" s
      JOIN "Asset" ast ON s.id = ast."siteId"
      JOIN "Report" r ON ast.id = r."assetId"
      LEFT JOIN "AiInference" a ON r.id = a."reportId"
      GROUP BY s.id, s.name
    `;
    const data = (res as any[]).map(row => ({
      ...row,
      sifRate: row.totalReports > 0 ? (row.sifReports / row.totalReports) : 0
    }));
    return { data };
  }

  async getByActivity() {
    const res = await this.prisma.$queryRaw`
      SELECT 
        act.name as activity,
        COUNT(r.id)::int as "totalReports",
        SUM(CASE WHEN a."sifClass" IN ('SIF_POTENTIAL', 'HIGH_SIF', 'CRITICAL_SIF') THEN 1 ELSE 0 END)::int as "sifReports"
      FROM "Activity" act
      JOIN "Report" r ON act.id = r."activityId"
      LEFT JOIN "AiInference" a ON r.id = a."reportId"
      GROUP BY act.name
    `;
    const data = (res as any[]).map(row => ({
      ...row,
      sifRate: row.totalReports > 0 ? (row.sifReports / row.totalReports) : 0
    }));
    return { data };
  }

  async getEnergyVectors() {
    return {
      message: "Energy vectors are not represented as a dedicated field in the current database schema.",
      data: []
    };
  }

  async getAgreement() {
    const feedbacks = await this.prisma.feedback.findMany();
    
    if (feedbacks.length === 0) {
      return {
        data: {
          agreementRate: null,
          sampleSize: 0,
          confirmed: 0,
          overridden: 0,
          status: 'INSUFFICIENT_DATA'
        }
      };
    }

    const sampleSize = feedbacks.length;
    let confirmed = 0;
    let overridden = 0;

    for (const fb of feedbacks) {
      if (fb.humanDecision === 'CONFIRMED') {
        confirmed++;
      } else {
        overridden++;
      }
    }

    const agreementRate = (confirmed / sampleSize) * 100;

    return {
      data: {
        agreementRate,
        sampleSize,
        confirmed,
        overridden,
        status: 'OK'
      }
    };
  }
}
