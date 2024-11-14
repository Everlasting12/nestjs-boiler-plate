import { RequestMethod } from '@nestjs/common';
import { IsEnum, IsJWT, IsString } from 'class-validator';

export class CheckAuthorizationDto {
  @IsJWT()
  token: string;

  @IsString()
  originalUrl: string;

  @IsString()
  protocol: string;

  @IsString()
  host: string;

  @IsString()
  @IsEnum(RequestMethod)
  httpMethod: string;
}
