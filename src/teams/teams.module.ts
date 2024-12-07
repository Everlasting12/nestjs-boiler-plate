import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TeamsRepository } from './teams.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TeamsController],
  providers: [PrismaService, TeamsService, TeamsRepository],
})
export class TeamsModule {}
