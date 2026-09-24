import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAMES, QUEUE_JOBS } from '../queue.constants';

@Injectable()
export class ReportAiProducer {
  private readonly logger = new Logger(ReportAiProducer.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.REPORT_AI_PROCESSING) private readonly queue: Queue,
  ) {}

  async enqueueReportForAiProcessing(reportId: string) {
    try {
      const job = await this.queue.add(
        QUEUE_JOBS.PROCESS_REPORT_AI,
        {
          reportId,
          attempt: 1,
          createdAt: new Date().toISOString(),
        },
        {
          jobId: `report-ai-${reportId}`, // Idempotency
        },
      );
      this.logger.log(`Enqueued AI processing job for report ${reportId}`);
      return job.id;
    } catch (error) {
      this.logger.error(`Failed to enqueue report ${reportId}: ${error.message}`);
      throw error;
    }
  }
}
