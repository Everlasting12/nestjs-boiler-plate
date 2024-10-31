import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SMS {
  @IsString()
  @Matches(/\d{10}/)
  recipient: string;

  @IsOptional()
  @IsObject()
  variables?: { [key: string]: string };
}
export class PUSH {
  @IsArray()
  @IsString({ each: true })
  recipient: string[];

  @IsOptional()
  @IsObject()
  variables?: { [key: string]: string };
}
export class EMAIL {
  @IsString()
  @IsEmail()
  recipient: string;

  @IsOptional()
  @IsObject()
  variables?: { [key: string]: string };
}

export class Payload {
  @IsOptional()
  @IsArray()
  SMS?: SMS[];

  @IsOptional()
  @IsArray()
  PUSH?: PUSH[];

  @IsOptional()
  @IsArray()
  EMAIL?: EMAIL[];
}

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  templateName: string;

  @IsNotEmptyObject()
  @IsObject()
  payload: Payload;
}
