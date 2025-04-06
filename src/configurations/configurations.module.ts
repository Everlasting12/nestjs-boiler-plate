import { Module } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { ConfigurationsRepository } from './configurations.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PrismaService, ConfigurationsService, ConfigurationsRepository],
  exports: [ConfigurationsService],
})
export class ConfigurationsModule {}
