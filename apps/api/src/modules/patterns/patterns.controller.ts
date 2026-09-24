import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { PatternsService } from './patterns.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { paginationSchema } from '../../common/pagination/pagination';

@ApiTags('Patterns')
@Controller('patterns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PatternsController {
  constructor(private readonly patternsService: PatternsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of identified precursor patterns' })
  getPatterns(@Query(new ZodValidationPipe(paginationSchema)) query: any) {
    return this.patternsService.getPatterns(query);
  }

  @Post('recompute')
  @ApiOperation({ summary: 'Trigger async recomputation of patterns' })
  recomputePatterns() {
    return this.patternsService.recomputePatterns();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific pattern' })
  getPatternById(@Param('id') id: string, @Query(new ZodValidationPipe(paginationSchema)) query: any) {
    return this.patternsService.getPatternById(id, query);
  }
}
