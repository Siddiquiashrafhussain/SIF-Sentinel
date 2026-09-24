import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SitesService {
  constructor(private readonly prisma: PrismaService) {}

  async getSites() {
    const sites = await this.prisma.site.findMany({
      orderBy: { name: 'asc' },
    });
    return { data: sites };
  }

  async getSiteAssets(siteId: string) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException('Site not found');

    const assets = await this.prisma.asset.findMany({
      where: { siteId },
      orderBy: { name: 'asc' },
    });

    return { data: assets };
  }
}
