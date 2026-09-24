import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES, QUEUE_JOBS } from '../queue.constants';
import { AiService } from '../../ai/ai.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Processor(QUEUE_NAMES.REPORT_AI_PROCESSING, { concurrency: parseInt(process.env.AI_WORKER_CONCURRENCY || '2', 10) })
export class ReportAiProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportAiProcessor.name);

  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name !== QUEUE_JOBS.PROCESS_REPORT_AI) return;
    const { reportId } = job.data;
    this.logger.log(`Processing AI job for report ${reportId}`);

    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { asset: true, activity: true },
    });

    if (!report) {
      this.logger.warn(`Report ${reportId} not found, skipping job.`);
      return;
    }

    try {
      const result = await this.aiService.predict({
        text: report.freeText,
        metadata: {
          site: report.asset.siteId,
          asset: report.asset.name,
          activity: report.activity.name,
          shift: report.shift,
        },
      });

      // Validated ML response -> store transactionally
      await this.prisma.$transaction(async (tx) => {
        // 1. AiInference Upsert
        await tx.aiInference.deleteMany({ where: { reportId: report.id } }); // Clear previous
        
        const inference = await tx.aiInference.create({
          data: {
            reportId: report.id,
            sifClass: result.sifClass as any,
            confidence: result.confidence,
            modelVersion: result.modelVersion,
            topDrivers: result.topDrivers,
          },
        });

        // 2. ReportLsr
        if (result.lsrs && result.lsrs.length > 0) {
          const rules = await tx.lifeSavingRule.findMany();
          const ruleMap = new Map(rules.map((r) => [r.code, r.id]));

          await tx.reportLsr.deleteMany({ where: { reportId: report.id } });
          
          for (const lsr of result.lsrs) {
            const ruleId = ruleMap.get(lsr.code);
            if (ruleId) {
              await tx.reportLsr.create({
                data: {
                  reportId: report.id,
                  lifeSavingRuleId: ruleId,
                },
              });
            } else {
              this.logger.warn(`Unknown LSR code returned by ML: ${lsr.code}`);
            }
          }
        }

        // 3. ReportBarrierGap
        if (result.barriers && result.barriers.length > 0) {
          const barriers = await tx.barrier.findMany();
          const barrierMap = new Map(barriers.map((b) => [b.code, b.id]));

          await tx.reportBarrierGap.deleteMany({ where: { reportId: report.id } });

          for (const gap of result.barriers) {
            const bId = barrierMap.get(gap.code);
            if (bId) {
              await tx.reportBarrierGap.create({
                data: {
                  reportId: report.id,
                  barrierId: bId,
                  evidence: gap.evidenceSpan || gap.status,
                },
              });
            } else {
              this.logger.warn(`Unknown barrier code returned by ML: ${gap.code}`);
            }
          }
        }

        // 4. Escalation & Notifications
        if (['HIGH_SIF', 'CRITICAL_SIF'].includes(result.sifClass)) {
          await this.notificationsService.createNotification(tx, {
            reportId: report.id,
            type: 'SIF_REVIEW_REQUIRED',
            title: 'High SIF potential report requires review',
            severity: result.sifClass,
          });
        }
      });

      this.logger.log(`Successfully processed AI job for report ${reportId}`);
    } catch (error) {
      this.logger.error(`AI job failed for report ${reportId}: ${error.message}`);
      throw error; // Let BullMQ handle retry
    }
  }
}
