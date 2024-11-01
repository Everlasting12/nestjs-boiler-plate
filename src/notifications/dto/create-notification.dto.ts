import {
  IsBoolean,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  notificationId?: string;

  @IsString()
  recipient: string;

  @IsString()
  templateName: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsBoolean()
  success: boolean;

  @IsNotEmptyObject()
  @IsObject()
  body: Record<string, any>;

  createdAt?: Date;
}
