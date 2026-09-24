import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ReviewModule } from './modules/review/review.module';
import { RulesModule } from './modules/rules/rules.module';
import { BarriersModule } from './modules/barriers/barriers.module';
import { PatternsModule } from './modules/patterns/patterns.module';
import { SitesModule } from './modules/sites/sites.module';
import { QueueModule } from './modules/queue/queue.module';
import { AiModule } from './modules/ai/ai.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AnalyticsModule,
    ReportsModule,
    ReviewModule,
    RulesModule,
    BarriersModule,
    PatternsModule,
    SitesModule,
    QueueModule,
    AiModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
