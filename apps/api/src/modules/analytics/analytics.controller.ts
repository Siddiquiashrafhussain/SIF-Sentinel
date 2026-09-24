import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get KPI overview' })
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('sif-trend')
  @ApiOperation({ summary: 'Get SIF trend over time' })
  getSifTrend() {
    return this.analyticsService.getSifTrend();
  }

  @Get('by-site')
  @ApiOperation({ summary: 'Get analytics by site' })
  getBySite() {
    return this.analyticsService.getBySite();
  }

  @Get('by-activity')
  @ApiOperation({ summary: 'Get analytics by activity' })
  getByActivity() {
    return this.analyticsService.getByActivity();
  }

  @Get('energy-vectors')
  @ApiOperation({ summary: 'Get analytics by energy vectors (Requires schema extension)' })
  getEnergyVectors() {
    // Energy vectors are not directly in schema, return appropriate message or use barrier gaps as proxy
    return this.analyticsService.getEnergyVectors();
  }

  @Get('agreement')
  @ApiOperation({ summary: 'Get AI/Human agreement KPI' })
  getAgreement() {
    return this.analyticsService.getAgreement();
  }
}
