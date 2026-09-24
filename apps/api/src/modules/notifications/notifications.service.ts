import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async createNotification(tx: any, data: { reportId: string; type: string; title: string; severity: string }) {
    try {
      // Use upsert to be idempotent
      await tx.notification.upsert({
        where: {
          reportId_type: {
            reportId: data.reportId,
            type: data.type,
          },
        },
        update: {},
        create: {
          reportId: data.reportId,
          type: data.type,
          title: data.title,
          severity: data.severity,
        },
      });
      this.logger.log(`Created notification ${data.type} for report ${data.reportId}`);
    } catch (error) {
      this.logger.error(`Failed to create notification: ${error.message}`);
      throw error;
    }
  }
}
