import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { QUEUE_NAMES } from './queue.constants';
import { ReportAiProducer } from './producers/report-ai.producer';
import { ReportAiProcessor } from './processors/report-ai.processor';
import { PatternProducer } from './producers/pattern.producer';
import { PatternProcessor } from './processors/pattern.processor';
import { AiModule } from '../ai/ai.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL') || 'redis://localhost:6379',
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.REPORT_AI_PROCESSING,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.PATTERN_RECOMPUTE,
      defaultJobOptions: {
        attempts: 2,
        removeOnComplete: 10,
        removeOnFail: 100,
      },
    }),
    AiModule,
    PrismaModule,
    NotificationsModule,
  ],
  providers: [ReportAiProducer, ReportAiProcessor, PatternProducer, PatternProcessor],
  exports: [ReportAiProducer, PatternProducer, BullModule],
})
export class QueueModule {}
