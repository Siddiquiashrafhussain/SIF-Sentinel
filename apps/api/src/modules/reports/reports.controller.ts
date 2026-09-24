import { Controller, Get, Post, Param, Query, Body, UseGuards, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { Response } from 'express';
import { ReportType } from '@prisma/client';
import { paginationSchema } from '../../common/pagination/pagination';
import { parse } from 'json2csv';

const getReportsSchema = paginationSchema.extend({
  type: z.string().optional(),
  sif: z.string().optional(),
  asset: z.string().optional(),
  lsr: z.string().optional(),
  status: z.string().optional(),
  q: z.string().optional(),
  site: z.string().optional(),
  activity: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  shift: z.string().optional(),
});

export const createReportSchema = z.object({
  reportCode: z.string(),
  type: z.enum(['NEAR_MISS', 'UNSAFE_ACT', 'UNSAFE_CONDITION', 'INCIDENT']),
  shift: z.string(),
  occurredAt: z.string().datetime(),
  freeText: z.string().min(1),
  source: z.string(),
  assetId: z.string(),
  activityId: z.string(),
});

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of reports' })
  getReports(@Query(new ZodValidationPipe(getReportsSchema)) query: any) {
    return this.reportsService.getReports(query);
  }

  @Get('export.csv')
  @ApiOperation({ summary: 'Export reports as CSV' })
  async exportCsv(@Query(new ZodValidationPipe(getReportsSchema)) query: any, @Res() res: Response) {
    const data = await this.reportsService.getAllReportsForExport(query);
    const csv = parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('reports_export.csv');
    return res.send(csv);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  getReportById(@Param('id') id: string) {
    return this.reportsService.getReportById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  createReport(@Body(new ZodValidationPipe(createReportSchema)) body: any) {
    return this.reportsService.createReport(body);
  }
}
