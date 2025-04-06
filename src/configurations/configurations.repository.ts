import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConfigurationsRepository {
  constructor(private prisma: PrismaService) {}
  async findOne(name: string) {
    return await this.prisma.configuration.findUnique({
      where: { name, isActive: true },
    });
  }
}
