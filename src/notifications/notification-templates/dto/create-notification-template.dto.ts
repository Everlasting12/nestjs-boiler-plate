import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PUSHChannelDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subTitle?: string;
}

export class EMAILChannelDto {
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  templateName?: string;
}

// ChannelType DTO
export class ChannelTypeDto {
  @IsOptional()
  @IsString()
  SMS?: string;

  @IsOptional()
  @IsString()
  EMAIL?: string;

  @IsOptional()
  @IsString()
  PUSH?: string;
}

// ChannelDetails DTO
export class ChannelDetailsDto<T> {
  @ValidateNested()
  @Type(() => Object) // Adjust if you have specific channel types
  content: T;

  @IsString({ each: true })
  variables: string[];

  @IsBoolean()
  isActive: boolean;
}

export class SMSChannelDetailsDto {
  @IsString()
  content: string;

  @IsString({ each: true })
  variables: string[];

  @IsBoolean()
  isActive: boolean;
}
// Channels DTO
export class ChannelsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => SMSChannelDetailsDto)
  SMS?: SMSChannelDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChannelDetailsDto<PUSHChannelDto>)
  PUSH?: ChannelDetailsDto<PUSHChannelDto>;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChannelDetailsDto<EMAILChannelDto>)
  EMAIL?: ChannelDetailsDto<EMAILChannelDto>;
}

// Main NotificationTemplate DTO
export class CreateNotificationTemplateDto {
  templateId?: string;

  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  name: string;

  @ValidateNested()
  @Type(() => ChannelTypeDto)
  channelType: ChannelTypeDto;

  @ValidateNested()
  @Type(() => ChannelsDto)
  channels: ChannelsDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
