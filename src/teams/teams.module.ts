import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TeamsRepository } from './teams.repository';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [TeamsController],
  providers: [PrismaService, TeamsService, TeamsRepository],
  exports: [TeamsService],
})
export class TeamsModule {}
