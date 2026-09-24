import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class AppController {
  @Get()
  getHealth() {
    return { status: 'ok', service: 'sif-sentinel-api' };
  }
}
