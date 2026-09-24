import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createPaginatedResponse } from '../../common/pagination/pagination';

@Injectable()
export class RulesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRules() {
    const rules = await this.prisma.lifeSavingRule.findMany({
      include: {
        reportLsrs: {
          include: {
            report: {
              include: {
                aiInferences: { orderBy: { createdAt: 'desc' }, take: 1 }
              }
            }
          }
        }
      }
    });

    const data = rules.map(rule => {
      const reportCount = rule.reportLsrs.length;
      let sifCount = 0;
      for (const rl of rule.reportLsrs) {
        const sifClass = rl.report.aiInferences[0]?.sifClass;
        if (sifClass === 'SIF_POTENTIAL' || sifClass === 'HIGH_SIF' || sifClass === 'CRITICAL_SIF') {
          sifCount++;
        }
      }

      return {
        code: rule.code,
        name: rule.name,
        area: rule.area,
        reportCount,
        sifCount,
        sifRate: reportCount > 0 ? (sifCount / reportCount) : 0,
      };
    });

    return { data };
  }

  async getRuleReports(code: string, query: any) {
    const rule = await this.prisma.lifeSavingRule.findUnique({ where: { code } });
    if (!rule) throw new NotFoundException('Life-Saving Rule not found');

    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;

    const where = { reportLsrs: { some: { lifeSavingRuleId: rule.id } } };
    
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
}
