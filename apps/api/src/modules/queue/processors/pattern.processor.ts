import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES, QUEUE_JOBS } from '../queue.constants';
import { AiService } from '../../ai/ai.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Processor(QUEUE_NAMES.PATTERN_RECOMPUTE, { concurrency: 1 })
export class PatternProcessor extends WorkerHost {
  private readonly logger = new Logger(PatternProcessor.name);

  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name !== QUEUE_JOBS.RECOMPUTE_PATTERNS) return;
    this.logger.log('Processing Pattern Recomputation Job');

    try {
      // Fetch all reports to cluster (in a real app, you'd send recent ones)
      const reports = await this.prisma.report.findMany({
        where: { status: 'VERIFIED' }, // Or any appropriate filter
        select: { id: true, freeText: true },
      });

      const result = await this.aiService.cluster({
        reports: reports.map(r => ({ id: r.id, text: r.freeText }))
      });

      if (result.clusters && result.clusters.length > 0) {
        await this.prisma.$transaction(async (tx) => {
          // Naive full replacement for demo
          await tx.clusterReport.deleteMany();
          await tx.patternCluster.deleteMany();

          for (const c of result.clusters) {
            const cluster = await tx.patternCluster.create({
              data: {
                clusterCode: c.clusterId,
                title: c.title,
                severity: c.severity,
                trend: 'STEADY',
                whereSummary: c.topTerms ? c.topTerms.join(', ') : '',
              },
            });

            if (c.reportIds && c.reportIds.length > 0) {
              const clusterReports = c.reportIds.map(rid => ({
                clusterId: cluster.id,
                reportId: rid,
              }));
              // In SQLite we can't createMany easily with relations, but in Postgres we can
              await tx.clusterReport.createMany({
                data: clusterReports,
                skipDuplicates: true
              });
            }
          }
        });
      }

      this.logger.log('Successfully recomputed patterns');
    } catch (error) {
      this.logger.error(`Pattern job failed: ${error.message}`);
      throw error;
    }
  }
}
