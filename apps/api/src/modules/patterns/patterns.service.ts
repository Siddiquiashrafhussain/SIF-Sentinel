import { Injectable, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createPaginatedResponse } from '../../common/pagination/pagination';
import { PatternProducer } from '../queue/producers/pattern.producer';

@Injectable()
export class PatternsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly patternProducer: PatternProducer
  ) {}

  async getPatterns(query: any) {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;

    const total = await this.prisma.patternCluster.count();
    const clusters = await this.prisma.patternCluster.findMany({
      skip,
      take: pageSize,
      include: {
        _count: {
          select: { reports: true }
        }
      }
    });

    const data = clusters.map(c => ({
      ...c,
      reportCount: c._count.reports
    }));

    return createPaginatedResponse(data, total, page, pageSize);
  }

  async getPatternById(id: string, query: any) {
    const cluster = await this.prisma.patternCluster.findUnique({ where: { id } });
    if (!cluster) throw new NotFoundException('Pattern not found');

    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;

    const totalReports = await this.prisma.clusterReport.count({ where: { clusterId: id } });
    const clusterReports = await this.prisma.clusterReport.findMany({
      where: { clusterId: id },
      skip,
      take: pageSize,
      include: {
        report: {
          include: {
            asset: { include: { site: true } },
            activity: true,
            aiInferences: { take: 1, orderBy: { createdAt: 'desc' } }
          }
        }
      }
    });

    return {
      data: {
        ...cluster,
        associatedReports: createPaginatedResponse(clusterReports.map(cr => cr.report), totalReports, page, pageSize)
      }
    };
  }

  async recomputePatterns() {
    const jobId = await this.patternProducer.enqueuePatternRecomputation();
    
    throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Pattern recomputation job queued.',
      jobId
    }, HttpStatus.ACCEPTED);
  }
}
