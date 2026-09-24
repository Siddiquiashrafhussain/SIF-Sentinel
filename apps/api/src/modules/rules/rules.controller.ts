import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RulesService } from './rules.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { paginationSchema } from '../../common/pagination/pagination';

@ApiTags('Life-Saving Rules')
@Controller('rules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Life-Saving Rules and their report statistics' })
  getRules() {
    return this.rulesService.getRules();
  }

  @Get(':code/reports')
  @ApiOperation({ summary: 'Get reports mapped to a specific Life-Saving Rule' })
  getRuleReports(
    @Param('code') code: string,
    @Query(new ZodValidationPipe(paginationSchema)) query: any,
  ) {
    return this.rulesService.getRuleReports(code, query);
  }
}
