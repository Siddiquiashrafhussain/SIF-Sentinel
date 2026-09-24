import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SitesService } from './sites.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Sites & Assets')
@Controller('sites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all sites' })
  getSites() {
    return this.sitesService.getSites();
  }

  @Get(':id/assets')
  @ApiOperation({ summary: 'Get assets for a specific site' })
  getSiteAssets(@Param('id') id: string) {
    return this.sitesService.getSiteAssets(id);
  }
}
