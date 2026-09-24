import { Controller, Get, UseGuards } from '@nestjs/common';
import { BarriersService } from './barriers.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Barriers')
@Controller('barriers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BarriersController {
  constructor(private readonly barriersService: BarriersService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get summary statistics of barriers and gaps' })
  getSummary() {
    return this.barriersService.getSummary();
  }

  @Get('gaps')
  @ApiOperation({ summary: 'Get details of specific barrier gaps' })
  getGaps() {
    return this.barriersService.getGaps();
  }

  @Get('integrity')
  @ApiOperation({ summary: 'Get integrity metrics for barriers by tier and class' })
  getIntegrity() {
    return this.barriersService.getIntegrity();
  }
}
