import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { paginationSchema } from '../../common/pagination/pagination';
import { Request } from 'express';

export const reviewSchema = z.object({
  decision: z.enum(['CONFIRMED', 'OVERRIDDEN']),
  note: z.string().optional(),
  correctedSifClass: z.string().optional(),
});

@ApiTags('Review')
@Controller('review')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('queue')
  @Roles(UserRole.HSE_OFFICER)
  @ApiOperation({ summary: 'Get reports needing review' })
  getQueue(@Query(new ZodValidationPipe(paginationSchema)) query: any) {
    return this.reviewService.getQueue(query);
  }

  @Get('needs-attention')
  @Roles(UserRole.HSE_OFFICER)
  @ApiOperation({ summary: 'Get summary of reports needing attention' })
  getNeedsAttention() {
    return this.reviewService.getNeedsAttention();
  }

  @Post(':reportId')
  @Roles(UserRole.HSE_OFFICER)
  @ApiOperation({ summary: 'Submit a human review for a report' })
  submitReview(
    @Param('reportId') reportId: string,
    @Body(new ZodValidationPipe(reviewSchema)) body: any,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.reviewService.submitReview(reportId, user.userId, body);
  }
}
