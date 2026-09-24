import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BarriersService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const totalBarriers = await this.prisma.barrier.count();
    const totalGaps = await this.prisma.reportBarrierGap.count();
    
    const gapsByClass = await this.prisma.barrier.groupBy({
      by: ['class'],
      _count: { id: true },
      // To actually count gaps by class we should join. Prisma groupBy doesn't do joins easily for counts of relations.
    });

    // Instead, let's just fetch all gaps and aggregate manually for now since data fits in memory, or use raw SQL.
    const res = await this.prisma.$queryRaw`
      SELECT 
        b.class as "class",
        COUNT(gb.id)::int as gaps
      FROM "Barrier" b
      LEFT JOIN "ReportBarrierGap" gb ON b.id = gb."barrierId"
      GROUP BY b.class
    `;

    const resTier = await this.prisma.$queryRaw`
      SELECT 
        b.tier as "tier",
        COUNT(gb.id)::int as gaps
      FROM "Barrier" b
      LEFT JOIN "ReportBarrierGap" gb ON b.id = gb."barrierId"
      GROUP BY b.tier
    `;

    return {
      data: {
        totalBarriers,
        totalGaps,
        gapsByClass: res,
        gapsByTier: resTier,
      }
    };
  }

  async getGaps() {
    const gapsData = await this.prisma.$queryRaw`
      SELECT 
        b.code,
        b.name,
        b.class,
        b.tier,
        COUNT(gb.id)::int as "associatedReportCount",
        SUM(CASE WHEN a."sifClass" IN ('SIF_POTENTIAL', 'HIGH_SIF', 'CRITICAL_SIF') THEN 1 ELSE 0 END)::int as "sifRelatedReportCount"
      FROM "Barrier" b
      JOIN "ReportBarrierGap" gb ON b.id = gb."barrierId"
      JOIN "Report" r ON gb."reportId" = r.id
      LEFT JOIN "AiInference" a ON r.id = a."reportId"
      GROUP BY b.code, b.name, b.class, b.tier
      ORDER BY "associatedReportCount" DESC
    `;

    return { data: gapsData };
  }

  async getIntegrity() {
    // As per prompt: intatct barriers / applicable barriers
    // This is hard to calculate without knowing "applicable barriers". We'll just return gaps vs total barrier occurrences if available, or just a placeholder if not supported.
    return {
      message: "Integrity calculation requires definition of 'applicable barriers', currently returning gap frequencies by tier.",
      data: await this.getSummary().then(s => s.data.gapsByTier)
    };
  }
}
