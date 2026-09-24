import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createPaginatedResponse } from '../../common/pagination/pagination';
import { ReportAiProducer } from '../queue/producers/report-ai.producer';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reportAiProducer: ReportAiProducer,
  ) {}

  private buildWhereClause(query: any) {
    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.asset) where.assetId = query.asset;
    if (query.status) where.status = query.status;
    if (query.shift) where.shift = query.shift;
    if (query.activity) where.activity = { name: query.activity };
    if (query.site) where.asset = { site: { name: query.site } };
    if (query.lsr) where.reportLsrs = { some: { lifeSavingRule: { code: query.lsr } } };
    if (query.sif) where.aiInferences = { some: { sifClass: query.sif } };
    
    if (query.from || query.to) {
      where.occurredAt = {};
      if (query.from) where.occurredAt.gte = new Date(query.from);
      if (query.to) where.occurredAt.lte = new Date(query.to);
    }
    
    // Fallback search, in production we should use full-text search
    if (query.q) {
      where.freeText = { contains: query.q, mode: 'insensitive' };
    }
    return where;
  }

  async getReports(query: any) {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const where = this.buildWhereClause(query);

    const total = await this.prisma.report.count({ where });
    const reports = await this.prisma.report.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { occurredAt: 'desc' },
      include: {
        asset: { include: { site: true } },
        activity: true,
        aiInferences: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    return createPaginatedResponse(reports, total, page, pageSize);
  }

  async getAllReportsForExport(query: any) {
    const where = this.buildWhereClause(query);
    const reports = await this.prisma.report.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
      include: {
        asset: { include: { site: true } },
        activity: true,
        aiInferences: { orderBy: { createdAt: 'desc' }, take: 1 },
        reportLsrs: { include: { lifeSavingRule: true } },
        barrierGaps: { include: { barrier: true } },
      }
    });

    return reports.map(r => ({
      reportCode: r.reportCode,
      type: r.type,
      occurredAt: r.occurredAt.toISOString(),
      site: r.asset.site.name,
      asset: r.asset.name,
      activity: r.activity.name,
      sifClass: r.aiInferences[0]?.sifClass || '',
      confidence: r.aiInferences[0]?.confidence || '',
      reviewStatus: r.status,
      lifeSavingRules: r.reportLsrs.map(l => l.lifeSavingRule.code).join('; '),
      barrierGaps: r.barrierGaps.map(b => b.barrier.code).join('; ')
    }));
  }

  async getReportById(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        asset: { include: { site: true } },
        activity: true,
        aiInferences: { orderBy: { createdAt: 'desc' } },
        reportLsrs: { include: { lifeSavingRule: true } },
        barrierGaps: { include: { barrier: true } },
        reviews: { include: { reviewer: true }, orderBy: { createdAt: 'desc' } },
        clusters: { include: { cluster: true } }
      }
    });

    if (!report) throw new NotFoundException('Report not found');
    return { data: report };
  }

  async createReport(data: any) {
    const asset = await this.prisma.asset.findUnique({ where: { id: data.assetId } });
    if (!asset) throw new BadRequestException('Invalid assetId');

    const activity = await this.prisma.activity.findUnique({ where: { id: data.activityId } });
    if (!activity) throw new BadRequestException('Invalid activityId');

    // Create report transactionally
    const report = await this.prisma.$transaction(async (tx) => {
      return tx.report.create({
        data: {
          reportCode: data.reportCode || `REP-${Date.now()}`,
          type: data.type,
          shift: data.shift || 'DAY',
          occurredAt: new Date(data.occurredAt),
          freeText: data.freeText,
          source: data.source || 'WEB',
          assetId: data.assetId,
          activityId: data.activityId,
          status: 'PENDING'
        }
      });
    });

    // Enqueue ML Job asynchronously
    const jobId = await this.reportAiProducer.enqueueReportForAiProcessing(report.id);

    return {
      message: 'Report created and queued for AI processing',
      data: {
        report,
        jobId,
      },
    };
  }
}
