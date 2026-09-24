import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAMES, QUEUE_JOBS } from '../queue.constants';

@Injectable()
export class PatternProducer {
  private readonly logger = new Logger(PatternProducer.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.PATTERN_RECOMPUTE) private readonly queue: Queue,
  ) {}

  async enqueuePatternRecomputation() {
    try {
      const job = await this.queue.add(
        QUEUE_JOBS.RECOMPUTE_PATTERNS,
        { attempt: 1, createdAt: new Date().toISOString() },
        { jobId: `recompute-${new Date().toISOString().split('T')[0]}` } // Daily idempotency
      );
      this.logger.log('Enqueued pattern recomputation job');
      return job.id;
    } catch (error) {
      this.logger.error(`Failed to enqueue pattern job: ${error.message}`);
      throw error;
    }
  }
}
