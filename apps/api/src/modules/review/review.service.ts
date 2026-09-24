import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createPaginatedResponse } from '../../common/pagination/pagination';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getQueue(query: any) {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;

    // Order by priority: Critical, High, SIF, non-sif
    const where = { status: ReportStatus.PENDING };
    const total = await this.prisma.report.count({ where });

    // Since sorting by relation field with specific values is complex, we fetch and let AI inferences dictate priority
    // For simplicity in Phase 4, we'll sort by occurredAt desc, or we can use raw query for exact priority sort
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

  async getNeedsAttention() {
    // Quick summary
    const count = await this.prisma.report.count({ where: { status: ReportStatus.PENDING } });
    return { data: { count } };
  }

  async submitReview(reportId: string, reviewerId: string, data: any) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { aiInferences: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!report) throw new NotFoundException('Report not found');

    const inference = report.aiInferences[0];
    if (!inference) throw new BadRequestException('Report has no AI inference to review');

    const user = await this.prisma.user.findUnique({ where: { id: reviewerId } });
    if (!user) throw new ForbiddenException('Reviewer not found');

    // Use transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1. Create Review
      const review = await prisma.review.create({
        data: {
          reportId,
          reviewerId,
          decision: data.decision,
          note: data.note || ''
        }
      });

      const humanSifClass = data.decision === 'CONFIRMED' 
        ? inference.sifClass 
        : (data.correctedSifClass || inference.sifClass);

      // 2. Create Feedback
      await prisma.feedback.create({
        data: {
          reportId,
          inferenceId: inference.id,
          reviewId: review.id,
          reviewerId,
          aiSifClass: inference.sifClass,
          modelVersion: inference.modelVersion,
          humanDecision: data.decision,
          humanSifClass,
          note: data.note,
        }
      });

      // 3. Update Report
      const updatedReport = await prisma.report.update({
        where: { id: reportId },
        data: { status: ReportStatus.VERIFIED }
      });

      // 4. Create AuditLog
      await prisma.auditLog.create({
        data: {
          actorId: reviewerId,
          action: 'REVIEW_SUBMITTED',
          entityType: 'Report',
          entityId: reportId,
          metadata: { decision: data.decision, previousStatus: report.status, newStatus: ReportStatus.VERIFIED }
        }
      });

      return { review, updatedReport };
    });

    return { data: result };
  }
}
