import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';
import { PermissionsModule } from './access-management/permissions/permissions.module';
import { RolesModule } from './access-management/roles/roles.module';
import { UserRolesModule } from './access-management/user-roles/user-roles.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { UploadModule } from 'libs/common/upload/upload.module';
import { LoggerService } from 'libs/common/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    NotificationsModule,
    HealthModule,
    PermissionsModule,
    RolesModule,
    UserRolesModule,
    ConfigurationsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    LoggerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
