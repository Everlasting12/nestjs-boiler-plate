import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService, ConfigService],
  exports: [UsersService],
})
export class UsersModule {}
